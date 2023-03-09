import { createContext, useContext } from "react"
import useLocalStorageState from "use-local-storage-state"

import { IMusic } from "@kmotion/types"
import { PlayerContextValues } from "../../types/contexts"
import { useLocalQueue } from "../hooks"

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
  const [loop, setLoop] = useLocalStorageState<boolean>("loop", { defaultValue: false })

  const { queue, actions } = useLocalQueue<IMusic>()

  return (
    <PlayerContext.Provider
      value={{
        currentMusic: queue.at(0) || null,
        queue,
        actions,
        loop: { value: loop, set: setLoop },
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export default PlayerProvider
