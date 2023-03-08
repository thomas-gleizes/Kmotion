import {
  LoginResponse,
  LogoutResponse,
  PlaylistResponse,
  PlaylistsResponse,
  RegisterResponse,
} from "@kmotion/types"
import { LoginDto, RegisterDto } from "@kmotion/validations"
import { Fetcher } from "./Fetcher"
import { Prisma } from "@prisma/client"
class Api {
  private fetcher: Fetcher

  constructor() {
    this.fetcher = new Fetcher("v1")
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

  public fetchPlaylists(withEntries: boolean): Promise<PlaylistsResponse> {
    return this.fetcher
      .get("playlists" + this.fetcher.parseQueryString({ entries: withEntries }), {})
      .then(this.toJson)
  }

  public fetchPlaylist(id: number, withEntries: boolean): Promise<PlaylistResponse> {
    return this.fetcher
      .get(`playlists/${id}` + this.fetcher.parseQueryString({ entries: withEntries }), {})
      .then(this.toJson)
  }

  public fetchEntries(id: number, include: Prisma.PlaylistEntryInclude) {
    return this.fetcher
      .get("playlists/" + id + "/entries" + this.fetcher.parseQueryString(include))
      .then(this.toJson)
  }
}

export const api = new Api()
