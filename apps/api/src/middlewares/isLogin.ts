import { FastifyRequest } from "fastify"

import { IUser } from "@kmotion/types"
import { userMapper } from "@kmotion/mappers"
import prisma from "../services/prisma"
import { UnauthorizedException } from "../exceptions/http/UnauthorizedException"
import { verifyToken } from "../utils/token"

export default async function isLogin(request: FastifyRequest) {
  if (!request.session.isLogin || verifyToken(request))
    throw new UnauthorizedException("Access denied 08")

  const user = await prisma.user.findUnique({ where: { id: request.session.user.id } })

  if (!user) throw new UnauthorizedException("Access denied 05")

  request.session.user = userMapper.one(user)
}

declare module "fastify" {
  interface Session {
    user: IUser
    isLogin: boolean
  }
}
