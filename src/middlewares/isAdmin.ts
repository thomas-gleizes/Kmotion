import { FastifyReply, FastifyRequest } from "fastify"
import { UnauthorizedException } from "exceptions/http/UnauthorizedException"
import { User } from "@prisma/client"

export default function isAdmin(request: FastifyRequest, reply: FastifyReply, next: Function) {
  if (!request.jwt) throw new UnauthorizedException("You must be logged in to access this route")
  if (!request.jwt.user.isAdmin)
    throw new UnauthorizedException("You must be an admin to access this route")

  request.user = request.jwt.user

  next()
}

declare module "fastify" {
  export interface FastifyRequest {
    user?: Omit<User, "password">
  }
}
