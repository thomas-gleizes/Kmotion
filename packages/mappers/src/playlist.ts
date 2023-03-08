import { IPlaylist, PrismaPlaylist } from "@kmotion/types"
import { Mapper } from "./lib/Mapper"
import { userMapper } from "./user"
import { entryMapper } from "./entry"

class PlaylistMapper extends Mapper<PrismaPlaylist, IPlaylist> {
  public one(input: PrismaPlaylist): IPlaylist {
    const output: IPlaylist = {
      id: input.id,
      title: input.title,
      slug: input.slug,
      description: input.description,
      authorId: input.authorId,
      visibility: input.visibility,
    }

    if (input.author) output.author = userMapper.one(input.author)
    if (input.entries) output.entries = entryMapper.many(input.entries)

    return output
  }
}

export const playlistMapper = new PlaylistMapper()
