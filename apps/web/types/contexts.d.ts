import { IMusic, IPlaylist, IUser } from "@kmotion/types"

// Auth
interface AuthenticatedValues {
  authenticated: true
  user: IUser
  logout: () => void
}

interface UnauthenticatedValues {
  authenticated: false
  login: (user: IUser, token: string) => void
}

declare type AuthContextValues = AuthenticatedValues | UnauthenticatedValues

// Player

declare type LoopType = "none" | "one" | "all"

declare type AssetType = { url: string; isFetching: boolean }

interface PlayerContextValues {
  currentMusic: IMusic | null
  playlist: { value: IPlaylist | null; set: (value: IPlaylist) => void }
  assets: {
    stream: AssetType
    cover: AssetType
    next: Omit<AssetType, "url">
  }
  queue: IMusic[]
  actions: UseStorageQueueActions<IMusic>
  loop: { value: LoopType; set: (value: LoopType) => void }
  history: IMusic[]
  fullscreen: { value: boolean; toggle: (value?: boolean) => void }
  playing: { value: boolean; toggle: (value?: boolean) => void }
}

// Layout

interface LayoutContextValues {
  isMobile: boolean
  isLaggedBlur: boolean
}
