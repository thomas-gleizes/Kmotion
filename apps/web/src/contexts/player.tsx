import { createContext, useContext } from "react"

const PlayerContext = createContext(null)

export const usePlayerContext = () => {
  const context = useContext(PlayerContext)

  return context
}

const PlayerProvider: ComponentWithChild = ({ children }) => {
  return <PlayerContext.Provider value={null}>{children}</PlayerContext.Provider>
}

export default PlayerContext
