import { Music, Playlist, PlaylistEntry, User } from "@prisma/client"

export declare type PrismaUser = User & PrismaUserRelations
export declare type PrismaUserRelations = {
  playlists?: PrismaPlaylist[]
  musics?: PrismaMusic[]
}

export declare type PrismaPlaylist = Playlist & PrismaPlaylistRelations
export declare type PrismaPlaylistRelations = {
  author?: PrismaUser
  entries?: PrismaEntry[]
}

export declare type PrismaMusic = Music & PrismaMusicRelations
export declare type PrismaMusicRelations = {
  playlistEntries?: PrismaEntry[]
  downloader?: PrismaUser
}

export declare type PrismaEntry = PlaylistEntry & PrismaEntryRelations
export declare type PrismaEntryRelations = {
  playlist?: PrismaPlaylist
  music?: PrismaMusic
}
