import { FastifyReply, FastifyRequest } from "fastify"
import { UnauthorizedException } from "exceptions/http/UnauthorizedException"
import { User } from "@prisma/client"

export default async function isAdmin(
  request: FastifyRequest,
  reply: FastifyReply,
  done: Function
) {
  if (!request.jwt) throw new UnauthorizedException("Access denied")
  if (!request.user.isAdmin) throw new UnauthorizedException("Access denied")

  request.user = request.jwt.user

  done()
}

declare module "fastify" {
  export interface FastifyRequest {
    user: Omit<User, "password">
  }
}
