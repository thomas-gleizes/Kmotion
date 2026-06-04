import { create } from "zustand"

interface AuthStore {
  token: string | null
  setToken: (token: string) => void
  clearToken: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: localStorage.getItem("extension_auth_token"),
  setToken: (token: string) => {
    localStorage.setItem("extension_auth_token", token)
    set({ token })
  },
  clearToken: () => {
    localStorage.removeItem("extension_auth_token")
    set({ token: null })
  },
}))

interface VideoStore {
  videoId: string | null
  isYoutube: boolean
  setVideoId: (videoId: string | null) => void
}

export const useVideoStore = create<VideoStore>((set) => ({
  videoId: null,
  isYoutube: false,
  setVideoId: (videoId: string | null) => {
    set({ videoId, isYoutube: !!videoId })
  },
}))

interface MusicStore {
  music: any | null
  isLoading: boolean
  error: string | null
  setMusic: (music: any) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  clearMusic: () => void
}

export const useMusicStore = create<MusicStore>((set) => ({
  music: null,
  isLoading: false,
  error: null,
  setMusic: (music: any) => set({ music, error: null }),
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
  clearMusic: () => set({ music: null, error: null }),
}))

