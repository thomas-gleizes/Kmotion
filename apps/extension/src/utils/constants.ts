export const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:3000/api/3.1"

export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
} as const

export const POLL_INTERVAL_MS = 5000
