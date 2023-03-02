import { IUser } from "@kmotion/types"

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
  ["dont_now"]: AuthContextValues
}
