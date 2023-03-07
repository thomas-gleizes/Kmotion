import { Music } from "@prisma/client"
import { IMusic } from "@kmotion/types"

import { Mapper } from "./lib/Mapper"

class MusicMapper extends Mapper<Music, IMusic> {
  one(input: Music): IMusic {
    return {
      id: input.id,
      youtubeId: input.youtubeId,
      title: input.title,
      artist: input.artist,
      downloaderId: input.downloaderId,
      links: {
        cover: `/api/v1/musics/${input.id}/cover`,
        stream: `/api/v1/musics/${input.id}/stream`,
      },
    }
  }
}

export const musicMapper = new MusicMapper()
