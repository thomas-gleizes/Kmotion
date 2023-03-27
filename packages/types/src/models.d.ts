import { Visibility } from "@prisma/client"

export type IUser = {
  id: number
  name: string
  email: string
  slug: string
  isAdmin: boolean
  isActivate: boolean
  visibility: Visibility
} & {
  playlists?: IPlaylist[]
  musics?: IMusic[]
}

export type IMusic = {
  id: number
  title: string
  artist: string | null
  youtubeId: string
  downloaderId: number
  duration: number
  links: {
    cover: string
    stream: string
  }
} & {
  playlistEntries?: IPlaylistEntry[]
  downloader?: IUser
}

export type IPlaylist = {
  id: number
  title: string
  description: string
  slug: string
  authorId: number
  visibility: Visibility
} & {
  author?: IUser
  entries?: IPlaylistEntry[]
}

export type IPlaylistEntry = {
  playlistId: number
  musicId: number
  position: number
} & {
  playlist?: IPlaylist
  music?: IMusic
}
