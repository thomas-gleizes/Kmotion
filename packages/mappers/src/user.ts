import { User } from "@prisma/client"
import { IUser } from "@kmotion/types"

import { Mapper } from "./lib/Mapper"

class UserMapper extends Mapper<User, IUser> {
  one(input: User): IUser {
    return {
      id: input.id,
      name: input.name,
      email: input.email,
      slug: input.slug,
      isAdmin: input.isAdmin,
      isActivate: input.isActivate,
      visibility: input.visibility,
    }
  }
}

export const userMapper = new UserMapper()
