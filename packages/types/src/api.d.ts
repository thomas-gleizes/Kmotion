import { IMusic, IPlaylist, IPlaylistEntry, IUser } from "./models"
import { ConvertedMusic, ConverterMusicDetails } from "./converter"

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
  info: {
    details: ConverterMusicDetails
    music: ConvertedMusic
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
