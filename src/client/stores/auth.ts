import create from "zustand"
import { TUser } from "types"

declare type UnAuthStore = {
  isAuthenticated: false
  user: null
}

declare type AuthStore = {
  isAuthenticated: true
  user: TUser
}

declare type Store = (AuthStore | UnAuthStore) & {
  login: (user: TUser) => void
  logout: () => void
}

const useAuthStore = create<Store>((set) => ({
  isAuthenticated: false,
  user: null,
  login: (user) => set({ isAuthenticated: true, user }),
  logout: () => set({ isAuthenticated: false, user: null })
}))

export default useAuthStore
