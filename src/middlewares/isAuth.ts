import { FastifyReply, FastifyRequest } from "fastify"
import { UnauthorizedException } from "exceptions/http/UnauthorizedException"
import { User } from "@prisma/client"

export default function isAuth(request: FastifyRequest, reply: FastifyReply, next: Function) {
  if (!request.jwt) throw new UnauthorizedException("You must be logged in to access this route")

  request.user = request.jwt.user

  next()
}

declare module "fastify" {
  export interface FastifyRequest {
    user?: Omit<User, "password">
  }
}
