import { IMusic, PrismaMusic } from "@kmotion/types"

import { Mapper } from "./lib/Mapper"
import { userMapper } from "./user"
import { entryMapper } from "./entry"

class MusicMapper extends Mapper<PrismaMusic, IMusic> {
  one(input: PrismaMusic): IMusic {
    const output: IMusic = {
      id: input.id,
      youtubeId: input.youtubeId,
      title: input.title,
      artist: input.artist,
      downloaderId: input.downloaderId,
      duration: input.duration,
      links: {
        cover: `/api/v1/musics/${input.id}/cover`,
        stream: `/api/v1/musics/${input.id}/stream`,
      },
    }

    if (input.downloader) output.downloader = userMapper.one(input.downloader)
    if (input.playlistEntries) output.playlistEntries = entryMapper.many(input.playlistEntries)

    return output
  }
}

export const musicMapper = new MusicMapper()
