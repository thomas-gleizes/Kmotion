import { FastifyReply, FastifyRequest } from "fastify"
import { UnauthorizedException } from "exceptions/http/UnauthorizedException"
import { User } from "@prisma/client"
import prisma from "utils/prisma"

export default async function isLogin(request: FastifyRequest, reply: FastifyReply) {
  if (!request.jwt) throw new UnauthorizedException("Access denied 08")

  const user = await prisma.user.findUnique({ where: { id: request.jwt.user.id } })

  if (!user) throw new UnauthorizedException("Access denied 05")

  // @ts-ignore
  delete user.password

  request.user = user
}

declare module "fastify" {
  export interface FastifyRequest {
    user: Omit<User, "password">
  }
}
