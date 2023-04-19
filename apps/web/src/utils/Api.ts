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
import { Fetcher } from "./Fetcher"
import { WINDOW_MESSAGE } from "./constants"

class Api {
  private fetcher: Fetcher

  constructor() {
    this.fetcher = new Fetcher("v1")

    this.fetcher.interceptResponse((response) => {
      if (!response.ok && response.status === 401)
        window.postMessage({ type: WINDOW_MESSAGE.logout })

      return response
    })
  }

  private toJson(response: Response) {
    return response.json()
  }

  public login(input: LoginDto): Promise<LoginResponse> {
    return this.fetcher.post("auth/login", { body: JSON.stringify(input) }).then(this.toJson)
  }

  public register(input: RegisterDto): Promise<RegisterResponse> {
    return this.fetcher.post("auth/register", { body: JSON.stringify(input) }).then(this.toJson)
  }

  public logout(): Promise<LogoutResponse> {
    return this.fetcher.post("auth/logout").then(this.toJson)
  }

  public profile(): Promise<LoginResponse> {
    return this.fetcher.get("users/me").then(this.toJson)
  }

  public createPlaylist(body: CreatePlaylistDto): Promise<PlaylistResponse> {
    return this.fetcher.post("playlists", { body: JSON.stringify(body) }).then(this.toJson)
  }

  public updatePlaylist(id: number, body: CreatePlaylistDto): Promise<PlaylistResponse> {
    return this.fetcher.put(`playlists/${id}`, { body: JSON.stringify(body) }).then(this.toJson)
  }

  public fetchPlaylists(withEntries: boolean): Promise<PlaylistsResponse> {
    return this.fetcher
      .get("playlists" + this.fetcher.parseQueryString({ entries: withEntries }))
      .then(this.toJson)
  }

  public fetchPlaylist(id: number, withEntries: boolean): Promise<PlaylistResponse> {
    return this.fetcher
      .get(`playlists/${id}` + this.fetcher.parseQueryString({ entries: withEntries }))
      .then(this.toJson)
  }

  public addMusicToPlaylist(params: AddMusicToPlaylistDto): Promise<PlaylistResponse> {
    return this.fetcher.post(`playlists/${params.id}/musics/${params.musicId}`).then(this.toJson)
  }

  public removeMusicFromPlaylist(params: AddMusicToPlaylistDto): Promise<SuccessResponseData> {
    return this.fetcher.delete(`playlists/${params.id}/musics/${params.musicId}`).then(this.toJson)
  }

  public fetchEntries(id: number, withMusic: boolean): Promise<PlaylistEntriesResponse> {
    return this.fetcher
      .get(`playlists/${id}/entries${this.fetcher.parseQueryString({ music: withMusic })}`)
      .then(this.toJson)
  }

  public fetchMusics(offset: number): Promise<MusicResponse> {
    return this.fetcher.get(`musics?offset=${offset}`).then(this.toJson)
  }

  public searchMusics(query: string): Promise<MusicResponse> {
    return this.fetcher.get(`musics/search?q=${query}`).then(this.toJson)
  }

  public deleteMusic(id: number): Promise<MusicShareResponse> {
    return this.fetcher.delete(`musics/${id}`).then(this.toJson)
  }

  public shareMusic(id: number): Promise<MusicShareResponse> {
    return this.fetcher.post(`musics/${id}/share`).then(this.toJson)
  }

  public bypassMusic(code: string): Promise<MusicByPassResponse> {
    return this.fetcher.get(`musics/bypass/${code}`).then(this.toJson)
  }
}

export const api = new Api()
