import { createContext, useContext, useEffect } from "react"
import useLocalStorageState from "use-local-storage-state"

import { IMusic } from "@kmotion/types"
import { LoopType, PlayerContextValues } from "../../types/contexts"
import { useLocalQueue } from "../hooks"
import { useToggle } from "react-use"
import { useQuery } from "@tanstack/react-query"
import { useImageLoader } from "../hooks/useImageLoader"

// TODO: replace it
const defaultMusic: IMusic = {
  id: 11,
  title: "AViVA - GRRRLS",
  artist: "MrSuicideSheep",
  youtubeId: "Shk7qcvqDOo",
  downloaderId: 1,
  links: {
    cover: "/api/v1/musics/11/cover",
    stream: "/api/v1/musics/11/stream",
  },
}

const PlayerContext = createContext<PlayerContextValues>(null as never)

export const usePlayerContext = () => {
  const context = useContext(PlayerContext)

  // if (!context) throw new Error("usePlayerContext must be used within PlayerProvider")

  return context
}

const PlayerProvider: ComponentWithChild = ({ children }) => {
  const [loop, setLoop] = useLocalStorageState<LoopType>("loop", { defaultValue: "none" })
  const [isFullscreen, toggleFullscreen] = useToggle(false)

  const { queue, actions } = useLocalQueue<IMusic>()

  const currentMusic = queue.at(0) || null

  const stream = useQuery({
    queryKey: ["music-stream", currentMusic?.id],
    queryFn: () =>
      fetch(currentMusic?.links.stream as string)
        .then((res) => res.blob())
        .then((blob) => URL.createObjectURL(blob)),
    enabled: !!currentMusic?.links.stream,
    staleTime: Infinity,
  })

  const [coverUrl] = useImageLoader(currentMusic?.links.cover)

  useEffect(() => {
    if ("mediaSession" in navigator && coverUrl && currentMusic)
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentMusic.title,
        artist: currentMusic.artist || "Unknown",
        artwork: [
          {
            src: "https://i.ytimg.com/vi_webp/MUMqVG8ECys/maxresdefault.webp",
            sizes: "512x512",
            type: "image/jpg",
          },
        ],
      })
  }, [currentMusic, coverUrl])

  return (
    <PlayerContext.Provider
      value={{
        currentMusic,
        assets: { cover: coverUrl, stream: stream.data },
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
