import { Visibility, Playlist } from "@prisma/client"

export interface IUser {
  id: number
  name: string
  email: string
  slug: string
  isAdmin: boolean
  isActivate: boolean
  visibility: Visibility
}

export interface IMusic {
  id: number
  title: string
  artist: string | null
  youtubeId: string
  downloaderId: number
}

export interface IPlaylist {
  id: number
  title: string
  description: string
  slug: string
  authorId: number
  visibility: Visibility
}

export interface IPlaylistEntry {
  playlistId: number
  musicId: number
  position: number
}
