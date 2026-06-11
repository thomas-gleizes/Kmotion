import createClient from "openapi-fetch"
import type { components, paths } from "../types/schema"
import { API_URL, STORAGE_KEYS } from "./constants"

export type Music = components["schemas"]["MusicResponseDto"]
export type MusicsPage = components["schemas"]["MusicsResponseDto"]
export type User = components["schemas"]["UserDto"]

export type MusicLookup = { status: "found"; music: Music } | { status: "not-found" }

// Kept in memory so the (sync) request middleware can read it. Hydrated from
// chrome.storage.local at popup startup via `loadToken()`.
let authToken: string | null = null

// One blob URL per music for the popup's lifetime — thumbnails are immutable, so
// re-mounting a row (tab switch, scroll) reuses the same fetch+decode.
const thumbnailCache = new Map<string, Promise<string>>()

class ExtensionAPI {
  private client: ReturnType<typeof createClient<paths>>

  constructor() {
    this.client = createClient<paths>({ baseUrl: API_URL })

    this.client.use({
      onRequest: ({ request }) => {
        if (authToken) {
          request.headers.set("authorization", `Bearer ${authToken}`)
        }
        return request
      },
    })
  }

  /** Read the persisted token into memory. Call once at startup. */
  async loadToken(): Promise<string | null> {
    const stored = await chrome.storage.local.get(STORAGE_KEYS.AUTH_TOKEN)
    authToken = (stored[STORAGE_KEYS.AUTH_TOKEN] as string | undefined) ?? null
    return authToken
  }

  getToken(): string | null {
    return authToken
  }

  async setToken(token: string): Promise<void> {
    authToken = token
    await chrome.storage.local.set({ [STORAGE_KEYS.AUTH_TOKEN]: token })
  }

  async clearAuth(): Promise<void> {
    authToken = null
    await chrome.storage.local.remove(STORAGE_KEYS.AUTH_TOKEN)
  }

  async login(credentials: { email: string; password: string }): Promise<string> {
    const { data, error, response } = await this.client.POST("/auth/login", {
      body: credentials,
      parseAs: "text",
    })

    if (error || !response.ok || !data) {
      throw new Error("Email ou mot de passe incorrect")
    }

    // The token is returned as a raw string body; strip accidental JSON quotes.
    return (data as string).trim().replace(/^"|"$/g, "")
  }

  async getProfile(): Promise<User> {
    const { data, error } = await this.client.GET("/users/me")
    if (error || !data) throw new Error("Session expirée")
    return data
  }

  async getMusicByYoutubeId(youtubeId: string): Promise<MusicLookup> {
    const { data, error, response } = await this.client.GET("/musics/media/{id}", {
      params: {
        path: { id: youtubeId },
        query: { mediaSource: "youtube" },
      },
    })

    if (response.status === 404) return { status: "not-found" }
    if (error || !data) throw new Error("Impossible de récupérer la vidéo")
    return { status: "found", music: data }
  }

  /** Adds the media to the library AND triggers its conversion (async). */
  async createMusicFromYoutube(youtubeId: string): Promise<void> {
    const { error, response } = await this.client.POST("/musics", {
      body: { mediaId: youtubeId, mediaSource: "youtube" },
    })

    if (error || !response.ok) {
      throw new Error(extractErrorMessage(error) ?? "La conversion a échoué")
    }
  }

  async getMusics(page: number, size: number): Promise<MusicsPage> {
    const { data, error } = await this.client.GET("/musics", {
      params: { query: { page, size } },
    })
    if (error || !data) throw new Error("Impossible de charger les musiques")
    return data
  }

  /** Thumbnails are behind auth, so they can't be used as a plain <img src>. */
  fetchThumbnailBlobUrl(musicId: string): Promise<string> {
    let blobUrl = thumbnailCache.get(musicId)
    if (!blobUrl) {
      blobUrl = this.loadThumbnail(musicId)
      blobUrl.catch(() => thumbnailCache.delete(musicId)) // allow retry after failure
      thumbnailCache.set(musicId, blobUrl)
    }
    return blobUrl
  }

  private async loadThumbnail(musicId: string): Promise<string> {
    const res = await fetch(`${API_URL}/musics/${musicId}/thumbnail`, {
      headers: authToken ? { authorization: `Bearer ${authToken}` } : undefined,
    })
    if (!res.ok) throw new Error("thumbnail unavailable")
    return URL.createObjectURL(await res.blob())
  }
}

function extractErrorMessage(error: unknown): string | undefined {
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message: unknown }).message
    if (typeof message === "string") return message
    if (Array.isArray(message)) return message.join(", ")
  }
  return undefined
}

export const api = new ExtensionAPI()
