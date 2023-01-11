import { FastifyReply, FastifyRequest } from "fastify"
import { UnauthorizedException } from "exceptions/http/UnauthorizedException"
import { User } from "@prisma/client"

export default async function isAdmin(
  request: FastifyRequest,
  reply: FastifyReply,
  done: Function
) {
  if (!request.session.isLogin) throw new UnauthorizedException("Access denied")
  if (!request.session.user.isAdmin) throw new UnauthorizedException("Access denied")
}

declare module "fastify" {
  export interface FastifyRequest {
    user: Omit<User, "password">
  }
}
