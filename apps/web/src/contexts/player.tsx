import { createContext, useContext, useEffect } from "react"
import useLocalStorageState from "use-local-storage-state"

import { IMusic } from "@kmotion/types"
import { LoopType, PlayerContextValues } from "../../types/contexts"
import { useLocalQueue } from "../hooks"
import { useToggle } from "react-use"
import { useQuery } from "@tanstack/react-query"

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
      fetch(currentMusic?.links.stream)
        .then((res) => res.blob())
        .then((blob) => URL.createObjectURL(blob)),
    enabled: !!currentMusic,
  })

  const cover = useQuery({
    queryKey: ["music-cover", currentMusic?.id],
    queryFn: () =>
      fetch(currentMusic?.links.cover)
        .then((res) => res.blob())
        .then((blob) => URL.createObjectURL(blob)),
    enabled: !!currentMusic,
  })

  useEffect(() => {
    if ("mediaSession" in navigator && cover.data && currentMusic)
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentMusic.title,
        artist: currentMusic.artist || "Unknown",
        artwork: [{ src: cover.data, sizes: "512x512", type: "image/jpg" }],
      })
  }, [currentMusic])

  return (
    <PlayerContext.Provider
      value={{
        currentMusic,
        assets: { cover: cover.data, stream: stream.data },
        queue,
        actions,
        loop: { value: loop, set: setLoop },
        fullscreen: { value: isFullscreen, toggle: toggleFullscreen },
      }}
    >
      <div className="fixed top-0 left-0">{JSON.stringify(stream.data, null, 2)}</div>
      {children}
    </PlayerContext.Provider>
  )
}

export default PlayerProvider
