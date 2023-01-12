import { createContext, useContext, useState } from "react"

interface Props {
  children: ReactNode
}

interface PlayerValues {
  viewMode: string
}

const VIEW_MODES = {
  PAGE: "page",
  MINIMIZE: "minimize",
  INACTIVE: "inactive"
}

export const PlayerContext = createContext(null)

const usePlayerContext = () => {
  return useContext(PlayerContext)
}

const PlayerProvider: Component<Props> = ({ children }) => {
  const [mode, setMode] = useState<string>(VIEW_MODES.INACTIVE)

  return <PlayerContext.Provider value={null}>{children}</PlayerContext.Provider>
}

export default PlayerProvider
