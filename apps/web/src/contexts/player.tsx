import { createContext, useContext, useEffect } from "react"
import useLocalStorageState from "use-local-storage-state"
import { useQuery } from "@tanstack/react-query"
import { useToggle } from "react-use"

import { IMusic } from "@kmotion/types"
import { LoopType, PlayerContextValues } from "../../types/contexts"
import { useStorageQueue, useImageLoader } from "../hooks"

const PlayerContext = createContext<PlayerContextValues>(null as never)

export const usePlayerContext = () => {
  const context = useContext(PlayerContext)

  // if (!context) throw new Error("usePlayerContext must be used within PlayerProvider")

  return context
}

const PlayerProvider: ComponentWithChild = ({ children }) => {
  const [loop, setLoop] = useLocalStorageState<LoopType>("loop", { defaultValue: "none" })
  const [musicsHistory, setMusicsHistory] = useLocalStorageState<IMusic[]>("musics-history", {
    defaultValue: [],
  })
  const [isFullscreen, toggleFullscreen] = useToggle(false)

  const { queue, actions } = useStorageQueue<IMusic>()

  const currentMusic = queue.at(0) || null
  const nexMusic = queue.at(1) || null

  const streamQuery = useQuery({
    queryKey: ["music-stream", currentMusic?.id],
    queryFn: () =>
      fetch(currentMusic?.links.stream as string)
        .then((res) => res.blob())
        .then((blob) => URL.createObjectURL(blob)),
    enabled: !!currentMusic?.links.stream,
    staleTime: Infinity,
  })

  useQuery({
    queryKey: ["music-stream", nexMusic?.id],
    queryFn: () =>
      fetch(nexMusic?.links.stream as string)
        .then((res) => res.blob())
        .then((blob) => URL.createObjectURL(blob)),
    enabled: !!nexMusic?.links.stream,
    staleTime: Infinity,
  })

  useEffect(() => {
    if (currentMusic)
      setMusicsHistory((state) =>
        state.at(-1)?.id === currentMusic.id ? state : [...state, currentMusic]
      )
  }, [currentMusic])

  const [coverUrl, coverQuery] = useImageLoader(currentMusic?.links.cover)
  useImageLoader(nexMusic?.links.cover)

  useEffect(() => {
    if ("mediaSession" in navigator && coverUrl && currentMusic)
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentMusic.title,
        artist: currentMusic.artist || "Unknown",
        album: "Unknown",
        artwork: [
          {
            src: "https://i.ytimg.com/vi_webp/MUMqVG8ECys/maxresdefault.webp",
            sizes: "512x512",
            type: "image/webp",
          },
        ],
      })
  }, [currentMusic, coverUrl])

  return (
    <PlayerContext.Provider
      value={{
        currentMusic,
        assets: {
          cover: { url: coverUrl, isFetching: coverQuery.isFetching },
          stream: { url: streamQuery.data || "", isFetching: streamQuery.isFetching },
        },
        history: musicsHistory,
        queue,
        actions,
        loop: { value: loop, set: setLoop },
        fullscreen: { value: isFullscreen, toggle: toggleFullscreen },
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export default PlayerProvider
