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

interface PlayerContextValues {
  loop: { value: boolean; set: (value: boolean) => void }
  currentMusic: IMusic | null
  queue: IMusic[]
  actions: UseLocalActions<IMusic>
}
