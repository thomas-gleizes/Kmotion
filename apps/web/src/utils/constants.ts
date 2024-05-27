export const WINDOW_MESSAGE = {
  logout: "logout",
} as const

export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  AUTH: "authenticated",
  TIME: "time",
  VOLUME: "volume",
  DEFAULT_PLAYING: "default_playing",
} as const

export const env = {
  API_URL: import.meta.env.VITE_API_URL,
} as const
