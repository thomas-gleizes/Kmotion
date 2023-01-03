import { FastifyReply, FastifyRequest } from "fastify"
import { UnauthorizedException } from "exceptions/http/UnauthorizedException"
import { User } from "@prisma/client"
import prisma from "services/prisma"

export default async function isLogin(request: FastifyRequest, reply: FastifyReply) {
  if (!request.session.isLogin) throw new UnauthorizedException("Access denied 08")

  const user = await prisma.user.findUnique({ where: { id: request.session.user.id } })

  if (!user) throw new UnauthorizedException("Access denied 05")

  // @ts-ignore
  delete user.password

  request.session.user = user
}

declare module "fastify" {
  interface Session {
    user: Omit<User, "password">
    isLogin: boolean
  }
}
