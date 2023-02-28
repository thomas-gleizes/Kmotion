import { FastifyRequest } from "fastify"
import { User } from "@prisma/client"

import { UnauthorizedException } from "../exceptions/http/UnauthorizedException"

export default async function isAdmin(request: FastifyRequest) {
  if (!request.session.isLogin) throw new UnauthorizedException("Access denied")
  if (!request.session.user.isAdmin) throw new UnauthorizedException("Access denied")
}

declare module "fastify" {
  export interface FastifyRequest {
    user: Omit<User, "password">
  }
}
