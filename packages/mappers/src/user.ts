import { IUser, PrismaUser } from "@kmotion/types"

import { Mapper } from "./lib/Mapper"
import { playlistMapper } from "./playlist"
import { musicMapper } from "./music"

class UserMapper extends Mapper<PrismaUser, IUser> {
  one(input: PrismaUser): IUser {
    const output: IUser = {
      id: input.id,
      name: input.name,
      email: input.email,
      slug: input.slug,
      isAdmin: input.isAdmin,
      isActivate: input.isActivate,
      visibility: input.visibility,
    }

    if (input.playlists) output.playlists = playlistMapper.many(input.playlists)
    if (input.musics) output.musics = musicMapper.many(input.musics)

    return output
  }
}

export const userMapper = new UserMapper()
