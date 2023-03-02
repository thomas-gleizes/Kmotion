import { FastifyRequest } from "fastify"
import { User } from "@prisma/client"

import prisma from "../services/prisma"
import { UnauthorizedException } from "../exceptions/http/UnauthorizedException"

export default async function isLogin(request: FastifyRequest) {
  if (!request.session.isLogin) throw new UnauthorizedException("Access denied 08")

  const user = await prisma.user.findUnique({ where: { id: request.session.user.id } })

  if (!user) throw new UnauthorizedException("Access denied 05")

  delete user.password

  request.session.user = user
}

declare module "fastify" {
  interface Session {
    user: Omit<User, "password">
    isLogin: boolean
  }
}
