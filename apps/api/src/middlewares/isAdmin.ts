import { FastifyRequest } from "fastify"

import { UnauthorizedException } from "../exceptions/http/UnauthorizedException"
import { IUser } from "@kmotion/types"
import isLogin from "./isLogin"

export default async function isAdmin(request: FastifyRequest) {
  await isLogin(request)

  if (!request.session.isLogin) throw new UnauthorizedException("Access denied")
  if (!request.session.user.isAdmin) throw new UnauthorizedException("Access denied")
}

declare module "fastify" {
  export interface FastifyRequest {
    user: IUser
  }
}
