import { IMusic, IUser } from "@kmotion/types"

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

interface PlayerContextValues {
  currentMusic: IMusic | null
  assets: {
    stream?: string
    cover?: string
  }
  queue: IMusic[]
  actions: UseLocalActions<IMusic>
  loop: { value: LoopType; set: (value: LoopType) => void }
  fullscreen: { value: boolean; toggle: (value?: boolean) => void }
}
