import { IMusic, IPlaylist, IPlaylistEntry, IUser } from "./models"

export interface SuccessData {
  success: true
}

export interface LoginResponse extends SuccessData {
  user: IUser
}

export interface RegisterResponse extends SuccessData {
  message: string
}

export type LogoutResponse = SuccessData

interface PlaylistsResponse extends SuccessData {
  playlists: IPlaylist[]
}

interface PlaylistResponse extends SuccessData {
  playlist: IPlaylist
}

interface PlaylistEntriesResponse extends SuccessData {
  entries: IPlaylistEntry[]
}

interface MusicResponse extends SuccessData {
  musics: IMusic[]
}
