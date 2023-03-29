import { IMusic, IPlaylist, IUser } from "@kmotion/types"

// Auth
interface AuthenticatedValues {
  authenticated: true
  user: IUser
  logout: () => void
}

interface UnauthenticatedValues {
  authenticated: false
  login: (user: IUser) => void
}

declare type AuthContextValues = AuthenticatedValues | UnauthenticatedValues

declare type IsAuth = {
  ["yes"]: AuthenticatedValues
  ["no"]: UnauthenticatedValues
  ["dont_know"]: AuthContextValues
}

// Player

declare type LoopType = "none" | "one" | "all"

declare type AssetType = { url: string; isFetching: boolean }

interface PlayerContextValues {
  currentMusic: IMusic | null
  playlist: { value: IPlaylist | null; set: (value: IPlaylist) => void }
  assets: {
    stream: AssetType
    cover: AssetType
  }
  queue: IMusic[]
  actions: UseStorageQueueActions<IMusic>
  loop: { value: LoopType; set: (value: LoopType) => void }
  history: IMusic[]
  fullscreen: { value: boolean; toggle: (value?: boolean) => void }
}

// Layout

interface LayoutContextValues {}

// Modals

interface ModalsContextValues {
  modals: ModalType[]
  addModal: (modal: ModalType) => void
  closeModal: (uid: string) => void
}
