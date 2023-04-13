import { IMusic, IPlaylist, IPlaylistEntry, IUser } from "./models"
import { ConverterMusicInfo } from "./converter"

export interface SuccessData {
  success: true
}

export interface MetaData {
  total: number
}

export interface LoginResponse extends SuccessData {
  user: IUser
  token: string
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

interface MusicSyncResponse extends SuccessData {
  musics: IMusic[]
}

interface MusicSearchResponse extends SuccessData {
  musics: IMusic[]
}

interface MusicResponse extends SuccessData {
  musics: IMusic[]
  meta: MetaData
}

interface MusicInfoResponse extends SuccessData {
  music: IMusic | null
  isReady: boolean
  info: ConverterMusicInfo
}
