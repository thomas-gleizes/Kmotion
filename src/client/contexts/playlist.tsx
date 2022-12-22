import { createContext, useContext } from "react"

interface PlaylistProviderProps {
  children: ReactNode
}

const PlaylistContext = createContext<any>({})

export const usePlaylistContext = () => {
  return useContext(PlaylistContext)
}

const PlaylistProvider: Component<PlaylistProviderProps> = ({ children }) => {
  return <PlaylistContext.Provider value={{}}>{children}</PlaylistContext.Provider>
}

export default PlaylistProvider
