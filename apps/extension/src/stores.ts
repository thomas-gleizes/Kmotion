import { create } from "zustand"
import type { User } from "./utils/api"
import { extractVideoId } from "./utils/youtube"

interface AuthStore {
  token: string | null
  user: User | null
  setSession: (token: string, user: User | null) => void
  setUser: (user: User) => void
  clear: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: null,
  user: null,
  setSession: (token, user) => set({ token, user }),
  setUser: (user) => set({ user }),
  clear: () => set({ token: null, user: null }),
}))

interface VideoStore {
  videoId: string | null
  isYoutube: boolean
  setTab: (url: string | undefined) => void
}

export const useVideoStore = create<VideoStore>((set) => ({
  videoId: null,
  isYoutube: false,
  setTab: (url) => {
    const isYoutube = !!url && /(?:www\.)?(youtube\.com|youtu\.be)/.test(url)
    set({ isYoutube, videoId: url ? extractVideoId(url) : null })
  },
}))
