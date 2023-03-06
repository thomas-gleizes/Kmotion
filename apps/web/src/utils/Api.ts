import { LoginResponse, LogoutResponse, PlaylistsResponse, RegisterResponse } from "@kmotion/types"
import { LoginDto, RegisterDto } from "@kmotion/validations"
import { Fetcher } from "./Fetcher"

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

  public fetchPlaylists(search?: { limit: number; skip: number }): Promise<PlaylistsResponse> {
    return this.fetcher.get("playlists", {}).then(this.toJson)
  }

  public fetchPlaylist(id: number): Promise<PlaylistsResponse> {
    return this.fetcher.get(`playlists/${id}`, {}).then(this.toJson)
  }
}

export const api = new Api()