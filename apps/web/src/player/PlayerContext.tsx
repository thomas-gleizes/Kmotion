import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { audioPath, getBlobUrl, thumbnailPath } from "./audioCache"
import { usePlayerStore } from "./playerStore"
import { useAudioSettingsStore } from "./audioSettingsStore"

export type Track = {
  id: string
  title: string
  artist: string
  duration: number
}

export type RepeatMode = "off" | "all" | "one"

type PlayerState = {
  queue: Track[]
  index: number
  current: Track | null
  isPlaying: boolean
  isLoading: boolean
  volume: number
  repeat: RepeatMode
  shuffle: boolean
  hasNext: boolean
}

// currentTime/duration changent ~4x/s (timeupdate) : contexte séparé pour que
// seuls les consommateurs de la progression (PlayerBar) re-rendent à cette fréquence.
type ProgressState = {
  currentTime: number
  duration: number
}

type PlayerActions = {
  playQueue: (tracks: Track[], startIndex?: number) => void
  toggle: () => void
  next: () => void
  prev: () => void
  seek: (seconds: number) => void
  seekBy: (delta: number) => void
  setVolume: (volume: number) => void
  adjustVolume: (delta: number) => void
  toggleMute: () => void
  cycleRepeat: () => void
  toggleShuffle: () => void
}

const PlayerContext = createContext<(PlayerState & PlayerActions) | null>(null)
const ProgressContext = createContext<ProgressState>({ currentTime: 0, duration: 0 })

// Deux platines audio (dual-deck), hors du cycle de rendu React : permet de
// faire jouer deux titres simultanément pendant un fondu enchaîné.
const decks = [new Audio(), new Audio()] as const

// Cadence de la rampe de volume du fondu enchaîné.
const FADE_STEP_MS = 50

// Sauvegarde l'instantané au plus toutes les 5 s pendant la lecture.
const SAVE_THROTTLE_MS = 5000

// Ordre de lecture : permutation des indices de la file. À plat quand le mode
// aléatoire est désactivé, mélangé (Fisher-Yates) sinon, le titre de départ
// restant en tête pour ne pas interrompre la lecture en cours.
function buildPlayOrder(length: number, shuffle: boolean, startIndex: number): number[] {
  const base = Array.from({ length }, (_, i) => i)
  if (!shuffle) return base
  const rest = base.filter((i) => i !== startIndex)
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[rest[i], rest[j]] = [rest[j], rest[i]]
  }
  return [startIndex, ...rest]
}

// Relit l'instantané persisté en assainissant l'ordre / la position au cas où
// le localStorage aurait été altéré.
function readSnapshot() {
  const s = usePlayerStore.getState().snapshot
  if (!s || s.queue.length === 0) return null
  const validOrder =
    s.order.length === s.queue.length && s.order.every((i) => i >= 0 && i < s.queue.length)
  const order = validOrder ? s.order : s.queue.map((_, i) => i)
  const orderPos = s.orderPos >= 0 && s.orderPos < order.length ? s.orderPos : 0
  return { ...s, order, orderPos }
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  // Capturé une seule fois au montage (initialiseur paresseux, sûr au render).
  const [snapshot] = useState(readSnapshot)

  const [queue, setQueue] = useState<Track[]>(snapshot ? snapshot.queue : [])
  const [index, setIndex] = useState(snapshot ? snapshot.order[snapshot.orderPos] : -1)
  const [orderPos, setOrderPos] = useState(snapshot ? snapshot.orderPos : -1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(snapshot ? snapshot.currentTime : 0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(snapshot?.volume ?? decks[0].volume)
  const [repeat, setRepeat] = useState<RepeatMode>(snapshot?.repeat ?? "off")
  const [shuffle, setShuffle] = useState(snapshot?.shuffle ?? false)

  const loadIdRef = useRef(0)
  const queueRef = useRef<Track[]>(snapshot ? snapshot.queue : [])
  const orderRef = useRef<number[]>(snapshot ? snapshot.order : [])
  const orderPosRef = useRef(snapshot ? snapshot.orderPos : -1)
  const repeatRef = useRef<RepeatMode>(snapshot?.repeat ?? "off")
  const shuffleRef = useRef(snapshot?.shuffle ?? false)
  // Position à restaurer une fois les métadonnées du titre repris chargées.
  const pendingSeekRef = useRef<number | null>(snapshot ? snapshot.currentTime : null)
  const lastSaveRef = useRef(0)

  // --- Moteur dual-deck / fondu enchaîné -----------------------------------
  // Platine active (0 ou 1) : celle dont le titre est affiché et dont la
  // progression pilote l'UI.
  const activeDeckRef = useRef(0)
  // Volume maître réglé par l'utilisateur (0–1), distinct du gain de fondu.
  const masterVolumeRef = useRef(snapshot?.volume ?? decks[0].volume)
  // Dernier volume non nul, pour restaurer le son après une coupure (mute).
  const lastVolumeRef = useRef(snapshot?.volume || 1)
  // Gain de fondu par platine : volume effectif = maître × gain.
  const deckGainRef = useRef<[number, number]>([1, 0])
  // Réglages du fondu, miroirs des valeurs du store (lus par le moteur audio).
  const crossfadeEnabledRef = useRef(false)
  const crossfadeDurationRef = useRef(6)
  const crossfadingRef = useRef(false)
  const fadeTimerRef = useRef<number | null>(null)

  const crossfadeEnabled = useAudioSettingsStore((s) => s.crossfadeEnabled)
  const crossfadeDuration = useAudioSettingsStore((s) => s.crossfadeDuration)
  useEffect(() => {
    crossfadeEnabledRef.current = crossfadeEnabled
    crossfadeDurationRef.current = crossfadeDuration
  }, [crossfadeEnabled, crossfadeDuration])

  const active = useCallback(() => decks[activeDeckRef.current], [])

  // Applique le volume effectif (maître × gain de fondu) à une platine.
  const applyVolume = useCallback((deck: number) => {
    decks[deck].volume = masterVolumeRef.current * deckGainRef.current[deck]
  }, [])

  // Persiste l'état courant pour reprise ultérieure (lit la position en direct
  // sur la platine active plutôt que sur l'état React, désynchronisé).
  const saveSnapshot = useCallback(() => {
    const tracks = queueRef.current
    const pos = orderPosRef.current
    if (tracks.length === 0 || pos < 0) return
    usePlayerStore.getState().save({
      queue: tracks,
      order: orderRef.current,
      orderPos: pos,
      currentTime: active().currentTime,
      repeat: repeatRef.current,
      shuffle: shuffleRef.current,
      volume: masterVolumeRef.current,
    })
  }, [active])

  // Alimente les contrôles média du navigateur / de l'OS (écran verrouillé,
  // notification, « Now Playing »). Métadonnées de base immédiates, puis pochette
  // dès qu'elle est prête. `guardId` invalide les pochettes de titres obsolètes.
  const updateMediaSession = useCallback((track: Track, guardId: number) => {
    if (!("mediaSession" in navigator)) return
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
    })
    void getBlobUrl(thumbnailPath(track.id))
      .then((thumbUrl) => {
        if (guardId !== loadIdRef.current) return
        navigator.mediaSession.metadata = new MediaMetadata({
          title: track.title,
          artist: track.artist,
          artwork: [{ src: thumbUrl, sizes: "480x360", type: "image/jpeg" }],
        })
      })
      .catch(() => {})
  }, [])

  // Charge un titre sur la platine active et le joue (coupure nette).
  const loadTrack = useCallback(
    async (track: Track, autoplay = true) => {
      const loadId = ++loadIdRef.current
      const deck = active()
      setIsLoading(true)
      setCurrentTime(0)
      setDuration(track.duration)
      try {
        const url = await getBlobUrl(audioPath(track.id))
        if (loadId !== loadIdRef.current) return
        deck.src = url
        deckGainRef.current[activeDeckRef.current] = 1
        applyVolume(activeDeckRef.current)
        if (autoplay) await deck.play()
      } catch {
        if (loadId === loadIdRef.current) setIsPlaying(false)
      } finally {
        if (loadId === loadIdRef.current) setIsLoading(false)
      }
      updateMediaSession(track, loadId)
    },
    [active, applyVolume, updateMediaSession],
  )

  // Interrompt un fondu en cours : coupe la rampe, rend la platine active à plein
  // volume et coupe la platine sortante.
  const cancelCrossfade = useCallback(() => {
    if (fadeTimerRef.current !== null) {
      clearInterval(fadeTimerRef.current)
      fadeTimerRef.current = null
    }
    if (!crossfadingRef.current) return
    const other = activeDeckRef.current ^ 1
    decks[other].pause()
    deckGainRef.current[other] = 0
    deckGainRef.current[activeDeckRef.current] = 1
    applyVolume(other)
    applyVolume(activeDeckRef.current)
    crossfadingRef.current = false
  }, [applyVolume])

  // Joue le titre à la position `pos` de l'ordre de lecture (coupure nette).
  const goToOrderPos = useCallback(
    (pos: number, autoplay = true) => {
      cancelCrossfade()
      const order = orderRef.current
      const tracks = queueRef.current
      if (pos < 0 || pos >= order.length) return
      const queueIndex = order[pos]
      orderPosRef.current = pos
      setOrderPos(pos)
      setIndex(queueIndex)
      void loadTrack(tracks[queueIndex], autoplay)
      // Préchargement du titre suivant dans l'ordre de lecture
      const upcoming = tracks[order[pos + 1]]
      if (upcoming) void getBlobUrl(audioPath(upcoming.id)).catch(() => {})
    },
    [cancelCrossfade, loadTrack],
  )

  // Position de lecture suivante en tenant compte du mode répétition, ou -1 s'il
  // n'y a pas de suivant.
  const nextOrderPos = useCallback(() => {
    let pos = orderPosRef.current + 1
    if (pos >= orderRef.current.length) {
      if (repeatRef.current === "all") pos = 0
      else return -1
    }
    return pos
  }, [])

  // Démarre un fondu enchaîné vers le titre suivant : charge l'entrant sur la
  // platine inactive, bascule l'active, puis fait la rampe linéaire des volumes.
  const startCrossfade = useCallback(() => {
    const pos = nextOrderPos()
    if (pos < 0) return
    const order = orderRef.current
    const tracks = queueRef.current
    const queueIndex = order[pos]
    const track = tracks[queueIndex]
    if (!track) return

    crossfadingRef.current = true
    const fromDeck = activeDeckRef.current
    const toDeck = fromDeck ^ 1
    const loadId = ++loadIdRef.current

    void getBlobUrl(audioPath(track.id))
      .then((url) => {
        // Fondu annulé / remplacé entre-temps (skip manuel, nouvelle file…).
        if (loadId !== loadIdRef.current || !crossfadingRef.current) return

        const incoming = decks[toDeck]
        incoming.src = url
        deckGainRef.current[toDeck] = 0
        applyVolume(toDeck)
        void incoming.play().catch(() => {})

        // La platine entrante devient active : sa progression pilote l'UI.
        activeDeckRef.current = toDeck
        orderPosRef.current = pos
        setOrderPos(pos)
        setIndex(queueIndex)
        setCurrentTime(0)
        setDuration(track.duration)
        updateMediaSession(track, loadId)
        const upcoming = tracks[order[pos + 1]]
        if (upcoming) void getBlobUrl(audioPath(upcoming.id)).catch(() => {})

        // Rampe linéaire : gain sortant 1→0, gain entrant 0→1.
        const fadeMs = Math.max(0.1, crossfadeDurationRef.current) * 1000
        const start = Date.now()
        if (fadeTimerRef.current !== null) clearInterval(fadeTimerRef.current)
        fadeTimerRef.current = window.setInterval(() => {
          const t = Math.min(1, (Date.now() - start) / fadeMs)
          deckGainRef.current[fromDeck] = 1 - t
          deckGainRef.current[toDeck] = t
          applyVolume(fromDeck)
          applyVolume(toDeck)
          if (t >= 1) {
            if (fadeTimerRef.current !== null) clearInterval(fadeTimerRef.current)
            fadeTimerRef.current = null
            decks[fromDeck].pause()
            decks[fromDeck].removeAttribute("src")
            deckGainRef.current[fromDeck] = 0
            deckGainRef.current[toDeck] = 1
            applyVolume(toDeck)
            crossfadingRef.current = false
          }
        }, FADE_STEP_MS)
      })
      .catch(() => {
        crossfadingRef.current = false
      })
  }, [applyVolume, nextOrderPos, updateMediaSession])

  const playQueue = useCallback(
    (tracks: Track[], startIndex = 0) => {
      if (startIndex < 0 || startIndex >= tracks.length) return
      queueRef.current = tracks
      setQueue(tracks)
      orderRef.current = buildPlayOrder(tracks.length, shuffleRef.current, startIndex)
      goToOrderPos(shuffleRef.current ? 0 : startIndex)
    },
    [goToOrderPos],
  )

  const next = useCallback(() => {
    const pos = nextOrderPos()
    if (pos < 0) return
    goToOrderPos(pos)
  }, [goToOrderPos, nextOrderPos])

  const prev = useCallback(() => {
    if (active().currentTime > 3) {
      active().currentTime = 0
      return
    }
    let pos = orderPosRef.current - 1
    if (pos < 0) {
      if (repeatRef.current === "all") pos = orderRef.current.length - 1
      else {
        active().currentTime = 0
        return
      }
    }
    goToOrderPos(pos)
  }, [active, goToOrderPos])

  const toggle = useCallback(() => {
    const deck = active()
    if (!deck.src) return
    if (deck.paused) void deck.play()
    else deck.pause()
  }, [active])

  const seek = useCallback(
    (seconds: number) => {
      active().currentTime = seconds
      setCurrentTime(seconds)
    },
    [active],
  )

  // Déplacement relatif (raccourcis clavier) : lit la position en direct sur
  // la platine active et la borne à la durée du titre.
  const seekBy = useCallback(
    (delta: number) => {
      const deck = active()
      const target = Math.min(deck.duration || Infinity, Math.max(0, deck.currentTime + delta))
      deck.currentTime = target
      setCurrentTime(target)
    },
    [active],
  )

  const setVolume = useCallback(
    (value: number) => {
      masterVolumeRef.current = value
      applyVolume(0)
      applyVolume(1)
      setVolumeState(value)
      saveSnapshot()
    },
    [applyVolume, saveSnapshot],
  )

  const adjustVolume = useCallback(
    (delta: number) => {
      const value = Math.min(1, Math.max(0, masterVolumeRef.current + delta))
      masterVolumeRef.current = value
      applyVolume(0)
      applyVolume(1)
      setVolumeState(value)
      saveSnapshot()
    },
    [applyVolume, saveSnapshot],
  )

  const toggleMute = useCallback(() => {
    if (masterVolumeRef.current > 0) {
      lastVolumeRef.current = masterVolumeRef.current
      masterVolumeRef.current = 0
      setVolumeState(0)
    } else {
      const restored = lastVolumeRef.current || 0.5
      masterVolumeRef.current = restored
      setVolumeState(restored)
    }
    applyVolume(0)
    applyVolume(1)
    saveSnapshot()
  }, [applyVolume, saveSnapshot])

  const cycleRepeat = useCallback(() => {
    const cycle: RepeatMode[] = ["off", "all", "one"]
    const nextMode = cycle[(cycle.indexOf(repeatRef.current) + 1) % cycle.length]
    repeatRef.current = nextMode
    setRepeat(nextMode)
    saveSnapshot()
  }, [saveSnapshot])

  // Bascule le mode aléatoire en conservant le titre en cours : on reconstruit
  // l'ordre autour de lui (mélangé ou remis à plat) sans relancer la lecture.
  const toggleShuffle = useCallback(() => {
    const tracks = queueRef.current
    const enabled = !shuffleRef.current
    shuffleRef.current = enabled
    setShuffle(enabled)
    if (tracks.length === 0) return
    const currentQueueIndex = orderRef.current[orderPosRef.current] ?? 0
    orderRef.current = buildPlayOrder(tracks.length, enabled, currentQueueIndex)
    const pos = enabled ? 0 : currentQueueIndex
    orderPosRef.current = pos
    setOrderPos(pos)
    saveSnapshot()
  }, [saveSnapshot])

  // Restaure le titre persisté au montage : chargé sans lecture automatique
  // (les navigateurs la bloquent), prêt à reprendre où l'utilisateur s'était arrêté.
  useEffect(() => {
    if (!snapshot) return
    masterVolumeRef.current = snapshot.volume
    deckGainRef.current = [1, 0]
    applyVolume(0)
    // Hydratation au montage : charger l'audio est un effet de bord légitime.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadTrack(snapshot.queue[snapshot.order[snapshot.orderPos]], false)
  }, [snapshot, loadTrack, applyVolume])

  useEffect(() => {
    const onPlay = (e: Event) => {
      if (e.currentTarget !== active()) return
      setIsPlaying(true)
      saveSnapshot()
    }
    const onPause = (e: Event) => {
      if (e.currentTarget !== active()) return
      setIsPlaying(false)
      saveSnapshot()
    }
    const onTime = (e: Event) => {
      if (e.currentTarget !== active()) return
      const deck = active()
      setCurrentTime(deck.currentTime)
      // Déclenchement du fondu enchaîné à l'approche de la fin du titre.
      if (crossfadeEnabledRef.current && !crossfadingRef.current && repeatRef.current !== "one") {
        const remaining = (deck.duration || 0) - deck.currentTime
        if (remaining > 0.2 && remaining <= crossfadeDurationRef.current && nextOrderPos() >= 0) {
          startCrossfade()
        }
      }
      const now = Date.now()
      if (now - lastSaveRef.current > SAVE_THROTTLE_MS) {
        lastSaveRef.current = now
        saveSnapshot()
      }
    }
    const onMeta = (e: Event) => {
      if (e.currentTarget !== active()) return
      const deck = active()
      setDuration(deck.duration || 0)
      const pending = pendingSeekRef.current
      if (pending != null) {
        pendingSeekRef.current = null
        if (pending > 0 && pending < (deck.duration || Infinity)) {
          deck.currentTime = pending
          setCurrentTime(pending)
        }
      }
    }
    const onEnded = (e: Event) => {
      // Une platine sortante qui se termine pendant un fondu est ignorée : la
      // rampe se charge du nettoyage.
      if (e.currentTarget !== active()) return
      if (repeatRef.current === "one") {
        active().currentTime = 0
        void active().play()
        return
      }
      const pos = nextOrderPos()
      if (pos < 0) {
        setIsPlaying(false)
        return
      }
      goToOrderPos(pos)
    }
    const onHidden = () => {
      if (document.visibilityState === "hidden") saveSnapshot()
    }
    for (const deck of decks) {
      deck.addEventListener("play", onPlay)
      deck.addEventListener("pause", onPause)
      deck.addEventListener("timeupdate", onTime)
      deck.addEventListener("loadedmetadata", onMeta)
      deck.addEventListener("ended", onEnded)
    }
    window.addEventListener("pagehide", saveSnapshot)
    document.addEventListener("visibilitychange", onHidden)

    if ("mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler("play", () => void active().play())
      navigator.mediaSession.setActionHandler("pause", () => active().pause())
      navigator.mediaSession.setActionHandler("nexttrack", next)
      navigator.mediaSession.setActionHandler("previoustrack", prev)
    }

    return () => {
      window.removeEventListener("pagehide", saveSnapshot)
      document.removeEventListener("visibilitychange", onHidden)
      for (const deck of decks) {
        deck.removeEventListener("play", onPlay)
        deck.removeEventListener("pause", onPause)
        deck.removeEventListener("timeupdate", onTime)
        deck.removeEventListener("loadedmetadata", onMeta)
        deck.removeEventListener("ended", onEnded)
      }
      if (fadeTimerRef.current !== null) {
        clearInterval(fadeTimerRef.current)
        fadeTimerRef.current = null
      }
    }
  }, [active, goToOrderPos, next, nextOrderPos, prev, saveSnapshot, startCrossfade])

  const value = useMemo(() => {
    const current = index >= 0 ? (queue[index] ?? null) : null
    const hasNext = repeat === "all" || orderPos < queue.length - 1
    return {
      queue,
      index,
      current,
      isPlaying,
      isLoading,
      volume,
      repeat,
      shuffle,
      hasNext,
      playQueue,
      toggle,
      next,
      prev,
      seek,
      seekBy,
      setVolume,
      adjustVolume,
      toggleMute,
      cycleRepeat,
      toggleShuffle,
    }
  }, [
    queue,
    index,
    orderPos,
    isPlaying,
    isLoading,
    volume,
    repeat,
    shuffle,
    playQueue,
    toggle,
    next,
    prev,
    seek,
    seekBy,
    setVolume,
    adjustVolume,
    toggleMute,
    cycleRepeat,
    toggleShuffle,
  ])

  const progress = useMemo(() => ({ currentTime, duration }), [currentTime, duration])

  return (
    <PlayerContext.Provider value={value}>
      <ProgressContext.Provider value={progress}>{children}</ProgressContext.Provider>
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (!context) throw new Error("usePlayer doit être utilisé dans un PlayerProvider")
  return context
}

export function usePlayerProgress() {
  return useContext(ProgressContext)
}
