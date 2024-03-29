export const WINDOW_MESSAGE = {
  logout: "logout",
} as const

export const QUERIES_KEY = {
  playlists: ["playlists"],
  musics_search: ["musics", "search"],
} as const

export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  AUTH: "authenticated",
  TIME: "time",
  VOLUME: "volume",
  DEFAULT_PLAYING: "default_playing",
} as const
