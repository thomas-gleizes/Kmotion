import ky from "ky"
import { KyInstance } from "ky/distribution/types/ky"

import {
  LoginResponse,
  LogoutResponse,
  MusicByPassResponse,
  MusicResponse,
  MusicShareResponse,
  PlaylistEntriesResponse,
  PlaylistResponse,
  PlaylistsResponse,
  RegisterResponse,
  SuccessResponseData,
} from "@kmotion/types"
import {
  AddMusicToPlaylistDto,
  CreatePlaylistDto,
  LoginDto,
  RegisterDto,
} from "@kmotion/validations"
import { LOCAL_STORAGE_KEYS, WINDOW_MESSAGE } from "./constants"

class jsonClient {
  private client: KyInstance

  constructor() {
    this.client = ky.create({
      prefixUrl: "/api/v1",
      hooks: {
        beforeRequest: [
          (request) => {
            const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)
            if (token) request.headers.set("authorization", `Bearer ${token}`)

            if (["POST", "PUT", "PATCH"].includes(request.method))
              request.headers.set("content-type", "application/json")
          },
        ],
        afterResponse: [
          async (request, options, response) => {
            if (!response.ok && response.status === 401)
              window.postMessage({ type: WINDOW_MESSAGE.logout })
          },
        ],
      },
      onDownloadProgress: (progress) => {
        console.log("progress", progress)
      },
    })
  }

  private toSearchParams(params: Record<string, any>): URLSearchParams {
    return new URLSearchParams(params)
  }

  public async login(input: LoginDto) {
    return this.client.post("auth/login", { body: JSON.stringify(input) }).json<LoginResponse>()
  }

  public register(input: RegisterDto) {
    return this.client
      .post("auth/register", { body: JSON.stringify(input) })
      .json<RegisterResponse>()
  }

  public profile() {
    return this.client.get("users/me").json<LoginResponse>()
  }

  public createPlaylist(body: CreatePlaylistDto) {
    return this.client.post("playlists", { body: JSON.stringify(body) }).json<PlaylistResponse>()
  }

  public updatePlaylist(id: number, body: CreatePlaylistDto) {
    return this.client
      .put(`playlists/${id}`, { body: JSON.stringify(body) })
      .json<PlaylistResponse>()
  }

  public fetchPlaylists(withEntries: boolean) {
    return this.client
      .get("playlists", { searchParams: this.toSearchParams({ entries: withEntries }) })
      .json<PlaylistsResponse>()
  }

  public fetchPlaylist(id: number, withEntries: boolean) {
    return this.client
      .get(`playlists/${id}`, { searchParams: this.toSearchParams({ entries: withEntries }) })
      .json<PlaylistResponse>()
  }

  public addMusicToPlaylist(params: AddMusicToPlaylistDto) {
    return this.client
      .post(`playlists/${params.id}/musics/${params.musicId}`, { body: "{}" })
      .json<PlaylistResponse>()
  }

  public removeMusicFromPlaylist(params: AddMusicToPlaylistDto) {
    return this.client
      .delete(`playlists/${params.id}/musics/${params.musicId}`)
      .json<SuccessResponseData>()
  }

  public fetchEntries(id: number, withMusic: boolean) {
    return this.client
      .get(`playlists/${id}/entries`, { searchParams: this.toSearchParams({ music: withMusic }) })
      .json<PlaylistEntriesResponse>()
  }

  public fetchMusics(offset: number) {
    return this.client.get(`musics?offset=${offset}`).json<MusicResponse>()
  }

  public searchMusics(query: string) {
    return this.client.get(`musics/search?q=${query}`).json<MusicResponse>()
  }

  public deleteMusic(id: number) {
    return this.client.delete(`musics/${id}`).json()
  }

  public shareMusic(id: number) {
    return this.client.post(`musics/${id}/share`, { body: "{}" }).json<MusicShareResponse>()
  }

  public bypassMusic(code: string) {
    return this.client.get(`musics/bypass/${code}`).json<MusicByPassResponse>()
  }

  public fetchMusic(id: number) {
    return this.client.get(`musics/${id}/stream`).blob()
  }

  public fetchCover(id: number) {
    return this.client.get(`musics/${id}/cover`).blob()
  }
}

export const api = new jsonClient()
