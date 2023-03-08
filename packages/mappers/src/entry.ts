import { IPlaylistEntry, PrismaEntry } from "@kmotion/types"
import { Mapper } from "./lib/Mapper"
import { musicMapper } from "./music"
import { playlistMapper } from "./playlist"

class EntryMapper extends Mapper<PrismaEntry, IPlaylistEntry> {
  one(input: PrismaEntry): IPlaylistEntry {
    const output: IPlaylistEntry = {
      musicId: input.musicId,
      playlistId: input.musicId,
      position: input.position,
    }

    if (input.music) output.music = musicMapper.one(input.music)
    if (input.playlist) output.playlist = playlistMapper.one(input.playlist)

    return output
  }
}

export const entryMapper = new EntryMapper()
