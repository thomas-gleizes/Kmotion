import { createContext, useEffect, useState } from "react"
import useLocalStorageState from "use-local-storage-state"
import { useToggle } from "react-use"

import { IMusic, IPlaylist } from "@kmotion/types"
import { LoopType, PlayerContextValues } from "../../types/contexts"
import { useContextFactory, useImageLoader, useStorageQueue, useStreamLoader } from "../hooks"
import { getImageResolution } from "../utils/helpers"

const PlayerContext = createContext<PlayerContextValues>(null as never)

export const usePlayerContext = useContextFactory(PlayerContext)

const PlayerProvider: ComponentWithChild = ({ children }) => {
  const [loop, setLoop] = useLocalStorageState<LoopType>("loop", { defaultValue: "none" })
  const [musicsHistory, setMusicsHistory] = useLocalStorageState<IMusic[]>("musics-history", {
    defaultValue: [],
  })
  const [isFullscreen, toggleFullscreen] = useToggle(false)

  const [currentPlaylist, setCurrentPlaylist] = useState<IPlaylist | null>(null)

  const { queue, actions } = useStorageQueue<IMusic>()

  const currentMusic = queue.at(0) || null
  const nexMusic = queue.at(1) || null

  const [streamUrl, streamQuery] = useStreamLoader(currentMusic?.id, {
    enabled: currentMusic !== null,
  })
  const [coverUrl, coverQuery] = useImageLoader(currentMusic?.id)

  useImageLoader(nexMusic?.id)
  useStreamLoader(nexMusic?.id, { enabled: currentMusic !== null })

  useEffect(() => {
    if (currentMusic)
      setMusicsHistory((state) =>
        state.at(-1)?.id === currentMusic.id ? state : [...state, currentMusic],
      )
  }, [currentMusic])

  useEffect(() => {
    if ("mediaSession" in navigator && coverUrl && currentMusic) {
      getImageResolution(coverUrl).then((resolution) => {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: currentMusic.title,
          artist: currentMusic.artist || "Unknown",
          artwork: [
            {
              src: coverUrl,
              sizes: `${resolution.width}x${resolution.height}`,
              type: "image/jpeg",
            },
          ],
        })
      })

      navigator.mediaSession.setActionHandler("previoustrack", () => actions.previous())
      navigator.mediaSession.setActionHandler("nexttrack", () => actions.next())
    }
  }, [currentMusic, coverUrl])

  return (
    <PlayerContext.Provider
      value={{
        currentMusic,
        playlist: { value: currentPlaylist, set: (value) => setCurrentPlaylist(value) },
        assets: {
          cover: { url: coverUrl || "", isFetching: coverQuery.isFetching },
          stream: { url: streamUrl || "", isFetching: streamQuery.isFetching },
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
