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
import { applyEqualizerSettings, ensureEqualizerGraph, resumeEqualizerContext } from "./equalizer"
import { useEqualizerStore } from "./equalizerStore"
import { usePlayerStore } from "./playerStore"

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
  playNext: (track: Track) => void
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

// Élément audio unique, hors du cycle de rendu React.
const audio = new Audio()

// Branche le graphe Web Audio (égaliseur) sur le premier geste de lecture :
// AudioContext démarre "suspended" tant qu'aucune interaction utilisateur n'a
// eu lieu, et createMediaElementSource ne peut être appelé qu'une seule fois.
function initEqualizer() {
  ensureEqualizerGraph(audio)
  applyEqualizerSettings(useEqualizerStore.getState().settings)
  resumeEqualizerContext()
}

// Réapplique les réglages dès qu'ils changent (page profil), même en cours de lecture.
useEqualizerStore.subscribe((state) => applyEqualizerSettings(state.settings))

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
  const [volume, setVolumeState] = useState(snapshot?.volume ?? audio.volume)
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
  // Dernier volume non nul, pour restaurer le son après une coupure (mute).
  const lastVolumeRef = useRef(snapshot?.volume || 1)

  // Persiste l'état courant pour reprise ultérieure (lit la position en direct
  // sur l'élément audio plutôt que sur l'état React, désynchronisé).
  const saveSnapshot = useCallback(() => {
    const tracks = queueRef.current
    const pos = orderPosRef.current
    if (tracks.length === 0 || pos < 0) return
    usePlayerStore.getState().save({
      queue: tracks,
      order: orderRef.current,
      orderPos: pos,
      currentTime: audio.currentTime,
      repeat: repeatRef.current,
      shuffle: shuffleRef.current,
      volume: audio.volume,
    })
  }, [])

  const loadTrack = useCallback(async (track: Track, autoplay = true) => {
    const loadId = ++loadIdRef.current
    setIsLoading(true)
    setCurrentTime(0)
    setDuration(track.duration)
    try {
      const url = await getBlobUrl(audioPath(track.id))
      if (loadId !== loadIdRef.current) return
      audio.src = url
      if (autoplay) {
        initEqualizer()
        await audio.play()
      }
    } catch {
      if (loadId === loadIdRef.current) setIsPlaying(false)
    } finally {
      if (loadId === loadIdRef.current) setIsLoading(false)
    }

    if ("mediaSession" in navigator) {
      // Métadonnées de base immédiates, puis pochette dès qu'elle est prête :
      // elle alimente les contrôles média du navigateur / de l'OS (écran
      // verrouillé, notification, « Now Playing », picture-in-picture).
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
      })
      void getBlobUrl(thumbnailPath(track.id))
        .then((thumbUrl) => {
          if (loadId !== loadIdRef.current) return
          navigator.mediaSession.metadata = new MediaMetadata({
            title: track.title,
            artist: track.artist,
            artwork: [{ src: thumbUrl, sizes: "480x360", type: "image/jpeg" }],
          })
        })
        .catch(() => {})
    }
  }, [])

  // Joue le titre à la position `pos` de l'ordre de lecture.
  const goToOrderPos = useCallback(
    (pos: number, autoplay = true) => {
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
    [loadTrack],
  )

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

  const playNext = useCallback(
    (track: Track) => {
      const tracks = queueRef.current
      if (tracks.length === 0) {
        queueRef.current = [track]
        setQueue([track])
        orderRef.current = [0]
        goToOrderPos(0)
        return
      }
      const newTracks = [...tracks, track]
      const newIndex = newTracks.length - 1
      const newOrder = [...orderRef.current]
      newOrder.splice(orderPosRef.current + 1, 0, newIndex)
      queueRef.current = newTracks
      orderRef.current = newOrder
      setQueue(newTracks)
      saveSnapshot()
    },
    [goToOrderPos, saveSnapshot],
  )

  const next = useCallback(() => {
    const order = orderRef.current
    let pos = orderPosRef.current + 1
    if (pos >= order.length) {
      if (repeatRef.current === "all") pos = 0
      else return
    }
    goToOrderPos(pos)
  }, [goToOrderPos])

  const prev = useCallback(() => {
    if (audio.currentTime > 3) {
      audio.currentTime = 0
      return
    }
    let pos = orderPosRef.current - 1
    if (pos < 0) {
      if (repeatRef.current === "all") pos = orderRef.current.length - 1
      else {
        audio.currentTime = 0
        return
      }
    }
    goToOrderPos(pos)
  }, [goToOrderPos])

  const toggle = useCallback(() => {
    if (!audio.src) return
    if (audio.paused) {
      initEqualizer()
      void audio.play()
    } else audio.pause()
  }, [])

  const seek = useCallback((seconds: number) => {
    audio.currentTime = seconds
    setCurrentTime(seconds)
  }, [])

  // Déplacement relatif (raccourcis clavier) : lit la position en direct sur
  // l'élément audio et la borne à la durée du titre.
  const seekBy = useCallback((delta: number) => {
    const target = Math.min(audio.duration || Infinity, Math.max(0, audio.currentTime + delta))
    audio.currentTime = target
    setCurrentTime(target)
  }, [])

  const setVolume = useCallback(
    (value: number) => {
      audio.volume = value
      setVolumeState(value)
      saveSnapshot()
    },
    [saveSnapshot],
  )

  const adjustVolume = useCallback(
    (delta: number) => {
      const value = Math.min(1, Math.max(0, audio.volume + delta))
      audio.volume = value
      setVolumeState(value)
      saveSnapshot()
    },
    [saveSnapshot],
  )

  const toggleMute = useCallback(() => {
    if (audio.volume > 0) {
      lastVolumeRef.current = audio.volume
      audio.volume = 0
      setVolumeState(0)
    } else {
      const restored = lastVolumeRef.current || 0.5
      audio.volume = restored
      setVolumeState(restored)
    }
    saveSnapshot()
  }, [saveSnapshot])

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
    audio.volume = snapshot.volume
    // Hydratation au montage : charger l'audio est un effet de bord légitime.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadTrack(snapshot.queue[snapshot.order[snapshot.orderPos]], false)
  }, [snapshot, loadTrack])

  useEffect(() => {
    const onPlay = () => {
      setIsPlaying(true)
      saveSnapshot()
    }
    const onPause = () => {
      setIsPlaying(false)
      saveSnapshot()
    }
    const onTime = () => {
      setCurrentTime(audio.currentTime)
      const now = Date.now()
      if (now - lastSaveRef.current > SAVE_THROTTLE_MS) {
        lastSaveRef.current = now
        saveSnapshot()
      }
    }
    const onMeta = () => {
      setDuration(audio.duration || 0)
      const pending = pendingSeekRef.current
      if (pending != null) {
        pendingSeekRef.current = null
        if (pending > 0 && pending < (audio.duration || Infinity)) {
          audio.currentTime = pending
          setCurrentTime(pending)
        }
      }
    }
    const onEnded = () => {
      if (repeatRef.current === "one") {
        audio.currentTime = 0
        void audio.play()
        return
      }
      const order = orderRef.current
      let pos = orderPosRef.current + 1
      if (pos >= order.length) {
        if (repeatRef.current === "all") pos = 0
        else {
          setIsPlaying(false)
          return
        }
      }
      goToOrderPos(pos)
    }
    const onHidden = () => {
      if (document.visibilityState === "hidden") saveSnapshot()
    }
    audio.addEventListener("play", onPlay)
    audio.addEventListener("pause", onPause)
    audio.addEventListener("timeupdate", onTime)
    audio.addEventListener("loadedmetadata", onMeta)
    audio.addEventListener("ended", onEnded)
    window.addEventListener("pagehide", saveSnapshot)
    document.addEventListener("visibilitychange", onHidden)

    if ("mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler("play", () => void audio.play())
      navigator.mediaSession.setActionHandler("pause", () => audio.pause())
      navigator.mediaSession.setActionHandler("nexttrack", next)
      navigator.mediaSession.setActionHandler("previoustrack", prev)
    }

    return () => {
      window.removeEventListener("pagehide", saveSnapshot)
      document.removeEventListener("visibilitychange", onHidden)
      audio.removeEventListener("play", onPlay)
      audio.removeEventListener("pause", onPause)
      audio.removeEventListener("timeupdate", onTime)
      audio.removeEventListener("loadedmetadata", onMeta)
      audio.removeEventListener("ended", onEnded)
    }
  }, [goToOrderPos, next, prev, saveSnapshot])

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
      playNext,
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
    playNext,
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
