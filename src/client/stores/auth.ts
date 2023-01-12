import create from "zustand"
import { TUser } from "types"

declare type UnAuthStore = {
  isLogin: false
  user: null
}

declare type AuthStore = {
  isLogin: true
  user: TUser
}

declare type Store = (AuthStore | UnAuthStore) & {
  login: (user: TUser) => void
  logout: () => void
}

const useAuthStore = create<Store>((set) => ({
  isLogin: false,
  user: null,
  login: (user) => set({ isLogin: true, user }),
  logout: () => set({ isLogin: false, user: null })
}))

export default useAuthStore
