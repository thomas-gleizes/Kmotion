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

type PlayerState = {
  queue: Track[]
  index: number
  current: Track | null
  isPlaying: boolean
  isLoading: boolean
  volume: number
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
}

const PlayerContext = createContext<(PlayerState & PlayerActions) | null>(null)
const ProgressContext = createContext<ProgressState>({ currentTime: 0, duration: 0 })

// Élément audio unique, hors du cycle de rendu React.
const audio = new Audio()

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<Track[]>([])
  const [index, setIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(audio.volume)

  const loadIdRef = useRef(0)
  const queueRef = useRef<Track[]>([])
  const indexRef = useRef(-1)

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

  const playAt = useCallback(
    (tracks: Track[], at: number) => {
      if (at < 0 || at >= tracks.length) return
      queueRef.current = tracks
      indexRef.current = at
      setQueue(tracks)
      setIndex(at)
      void loadTrack(tracks[at])
      // Préchargement du titre suivant
      const upcoming = tracks[at + 1]
      if (upcoming) void getBlobUrl(audioPath(upcoming.id)).catch(() => {})
    },
    [loadTrack],
  )

  const playQueue = useCallback(
    (tracks: Track[], startIndex = 0) => playAt(tracks, startIndex),
    [playAt],
  )

  const next = useCallback(() => {
    playAt(queueRef.current, indexRef.current + 1)
  }, [playAt])

  const prev = useCallback(() => {
    if (audio.currentTime > 3) {
      audio.currentTime = 0
      return
    }
    playAt(queueRef.current, indexRef.current - 1)
  }, [playAt])

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

  useEffect(() => {
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onTime = () => setCurrentTime(audio.currentTime)
    const onMeta = () => setDuration(audio.duration || 0)
    const onEnded = () => {
      if (indexRef.current + 1 < queueRef.current.length) {
        playAt(queueRef.current, indexRef.current + 1)
      } else {
        setIsPlaying(false)
      }
    }
    audio.addEventListener("play", onPlay)
    audio.addEventListener("pause", onPause)
    audio.addEventListener("timeupdate", onTime)
    audio.addEventListener("loadedmetadata", onMeta)
    audio.addEventListener("ended", onEnded)

    if ("mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler("play", () => void audio.play())
      navigator.mediaSession.setActionHandler("pause", () => audio.pause())
      navigator.mediaSession.setActionHandler("nexttrack", () =>
        playAt(queueRef.current, indexRef.current + 1),
      )
      navigator.mediaSession.setActionHandler("previoustrack", () =>
        playAt(queueRef.current, indexRef.current - 1),
      )
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
  }, [playAt])

  const value = useMemo(() => {
    const current = index >= 0 ? (queue[index] ?? null) : null
    return {
      queue,
      index,
      current,
      isPlaying,
      isLoading,
      volume,
      playQueue,
      toggle,
      next,
      prev,
      seek,
      setVolume,
    }
  }, [queue, index, isPlaying, isLoading, volume, playQueue, toggle, next, prev, seek, setVolume])

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
