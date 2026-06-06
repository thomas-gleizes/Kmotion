import createClient from "openapi-fetch"
import { paths } from "../types/schema"

const STORAGE_KEY_TOKEN = "auth_token"
const STORAGE_KEY_USER = "auth_user"

// Base URL for the API (as defined in app constants)
const API_BASE_URL = "http://localhost:3000/api/3.1"

class ExtensionAPI {
  private client: ReturnType<typeof createClient<paths>>

  constructor() {
    this.client = createClient<paths>({
      baseUrl: API_BASE_URL,
    })

    // Middleware to add auth token
    this.client.use({
      onRequest: ({ request }) => {
        const token = localStorage.getItem(STORAGE_KEY_TOKEN)
        if (token) {
          request.headers.set("authorization", `Bearer ${token}`)
        }
        return request
      },
    })
  }

  async login(credentials: { email: string; password: string }) {
    const { data, error } = await this.client.POST("/auth/login", {
      body: credentials,
    })

    if (error || !data) {
      throw new Error("Login failed")
    }

    // data is the token string according to app controller
    return { accessToken: data }
  }

  async getProfile() {
    const { data, error } = await this.client.GET("/users/me")
    if (error) throw error
    return data
  }

  async getMusicByYoutubeId(youtubeId: string) {
    try {
      const { data, error } = await this.client.GET("/musics/media/{id}", {
        params: {
          path: { id: youtubeId },
          query: { mediaSource: "youtube" as any },
        },
      })

      if (error || !data) return null
      return data
    } catch (error) {
      return null
    }
  }

  async createMusicFromYoutube(youtubeId: string) {
    const { data, error } = await this.client.POST("/musics/", {
      body: {
        mediaId: youtubeId,
        mediaSource: "youtube" as any,
      },
    })

    if (error || !data) {
      throw new Error("Creation failed")
    }

    return data
  }

  async convertMusicToMp3(musicId: string) {
    // There is no explicit "convert" endpoint now, sync might be the closest or it's automatic
    const { data, error } = await this.client.POST("/musics/sync")
    if (error) throw error
    return data
  }

  setToken(token: string) {
    localStorage.setItem(STORAGE_KEY_TOKEN, token)
  }

  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEY_TOKEN)
  }

  clearAuth() {
    localStorage.removeItem(STORAGE_KEY_TOKEN)
    localStorage.removeItem(STORAGE_KEY_USER)
  }
}

export const api = new ExtensionAPI()
