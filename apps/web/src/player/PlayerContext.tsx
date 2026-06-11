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
import { audioPath, getBlobUrl } from "./audioCache"

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
  setVolume: (volume: number) => void
  cycleRepeat: () => void
  toggleShuffle: () => void
}

const PlayerContext = createContext<(PlayerState & PlayerActions) | null>(null)
const ProgressContext = createContext<ProgressState>({ currentTime: 0, duration: 0 })

// Élément audio unique, hors du cycle de rendu React.
const audio = new Audio()

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

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<Track[]>([])
  const [index, setIndex] = useState(-1)
  const [orderPos, setOrderPos] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(audio.volume)
  const [repeat, setRepeat] = useState<RepeatMode>("off")
  const [shuffle, setShuffle] = useState(false)

  const loadIdRef = useRef(0)
  const queueRef = useRef<Track[]>([])
  const orderRef = useRef<number[]>([])
  const orderPosRef = useRef(-1)
  const repeatRef = useRef<RepeatMode>("off")
  const shuffleRef = useRef(false)

  const loadTrack = useCallback(async (track: Track, autoplay = true) => {
    const loadId = ++loadIdRef.current
    setIsLoading(true)
    setCurrentTime(0)
    setDuration(track.duration)
    try {
      const url = await getBlobUrl(audioPath(track.id))
      if (loadId !== loadIdRef.current) return
      audio.src = url
      if (autoplay) await audio.play()
    } catch {
      if (loadId === loadIdRef.current) setIsPlaying(false)
    } finally {
      if (loadId === loadIdRef.current) setIsLoading(false)
    }

    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
      })
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
    if (audio.paused) void audio.play()
    else audio.pause()
  }, [])

  const seek = useCallback((seconds: number) => {
    audio.currentTime = seconds
    setCurrentTime(seconds)
  }, [])

  const setVolume = useCallback((value: number) => {
    audio.volume = value
    setVolumeState(value)
  }, [])

  const cycleRepeat = useCallback(() => {
    const cycle: RepeatMode[] = ["off", "all", "one"]
    const nextMode = cycle[(cycle.indexOf(repeatRef.current) + 1) % cycle.length]
    repeatRef.current = nextMode
    setRepeat(nextMode)
  }, [])

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
  }, [])

  useEffect(() => {
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onTime = () => setCurrentTime(audio.currentTime)
    const onMeta = () => setDuration(audio.duration || 0)
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
    audio.addEventListener("play", onPlay)
    audio.addEventListener("pause", onPause)
    audio.addEventListener("timeupdate", onTime)
    audio.addEventListener("loadedmetadata", onMeta)
    audio.addEventListener("ended", onEnded)

    if ("mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler("play", () => void audio.play())
      navigator.mediaSession.setActionHandler("pause", () => audio.pause())
      navigator.mediaSession.setActionHandler("nexttrack", next)
      navigator.mediaSession.setActionHandler("previoustrack", prev)
    }

    // Barre espace = lecture/pause, sauf pendant la saisie dans un champ
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space") return
      const target = event.target as HTMLElement
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
        return
      if (!audio.src) return
      event.preventDefault()
      if (audio.paused) void audio.play()
      else audio.pause()
    }
    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
      audio.removeEventListener("play", onPlay)
      audio.removeEventListener("pause", onPause)
      audio.removeEventListener("timeupdate", onTime)
      audio.removeEventListener("loadedmetadata", onMeta)
      audio.removeEventListener("ended", onEnded)
    }
  }, [goToOrderPos, next, prev])

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
      setVolume,
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
    setVolume,
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
