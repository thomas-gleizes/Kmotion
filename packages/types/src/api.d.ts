import { IMusic, IPlaylist, IPlaylistEntry, IUser } from "./models"
import { Track, YoutubeInfo } from "./converter"

export interface SuccessResponseData {
  success: true
}

export interface MetaData {
  total: number
}

export interface LoginResponse extends SuccessResponseData {
  user: IUser
  token: string
}

export interface RegisterResponse extends SuccessResponseData {
  message: string
}

export type LogoutResponse = SuccessResponseData

interface PlaylistsResponse extends SuccessResponseData {
  playlists: IPlaylist[]
}

interface PlaylistResponse extends SuccessResponseData {
  playlist: IPlaylist
}

interface PlaylistEntriesResponse extends SuccessResponseData {
  entries: IPlaylistEntry[]
}

interface MusicSyncResponse extends SuccessResponseData {
  musics: IMusic[]
}

interface MusicSearchResponse extends SuccessResponseData {
  musics: IMusic[]
}

interface MusicResponse extends SuccessResponseData {
  musics: IMusic[]
  meta: MetaData
}

interface MusicInfoResponse extends SuccessResponseData {
  music: IMusic | null
  isReady: boolean
  details: {
    info: YoutubeInfo
    track: Track
  }
}

interface MusicShareResponse extends SuccessResponseData {
  music: IMusic
  link: string
}

interface MusicByPassResponse extends SuccessResponseData {
  music: IMusic
  song: string
  cover: string
}

interface HlsMusicResponse extends SuccessResponseData {
  url: string
}

interface UsersResponse extends SuccessResponseData {
  users: IUser[]
}
