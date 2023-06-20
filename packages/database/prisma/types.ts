import type { ColumnType } from "kysely"

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>
export type Timestamp = ColumnType<Date, Date | string, Date | string>

import type { BypassCodeType, Visibility } from "./enums"

export interface BypassCode {
  id: Generated<number>
  code: string
  target_id: string
  type: BypassCodeType
  valid: Generated<number>
  expireAt: Timestamp
  created_at: Generated<Timestamp>
  updated_at: Generated<Timestamp>
}

export interface Music {
  id: Generated<number>
  title: string
  artist: string | null
  youtube_id: string
  downloader_id: number
  duration: number
  created_at: Generated<Timestamp>
  updated_at: Generated<Timestamp>
}

export interface Playlist {
  id: Generated<number>
  title: string
  description: string
  slug: string
  author_id: number
  visibility: Generated<Visibility>
  created_at: Generated<Timestamp>
  updated_at: Generated<Timestamp>
}

export interface PlaylistEntry {
  playlist_id: number
  music_id: number
  position: number
  created_at: Generated<Timestamp>
  updated_at: Generated<Timestamp>
}

export interface User {
  id: Generated<number>
  name: string
  email: string
  password: string
  slug: string
  is_admin: Generated<number>
  is_activate: Generated<number>
  visibility: Generated<Visibility>
  created_at: Generated<Timestamp>
  updated_at: Generated<Timestamp>
}

export type DB = {
  bypass_codes: BypassCode
  musics: Music
  playlists: Playlist
  playlist_entries: PlaylistEntry
  users: User
}
