import PlaylistProvider from "client/contexts/playlist"

interface Props {
  children: ReactNode
}

const ContextsProvider: Component<Props> = ({ children }) => {
  return <PlaylistProvider>{children}</PlaylistProvider>
}

export default ContextsProvider
