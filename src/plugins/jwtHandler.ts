import { FastifyReply, FastifyRequest } from "fastify"
import { verifyJwt } from "utils/jwt"

export default function jwtHandler(request: FastifyRequest, reply: FastifyReply, next: Function) {
  if (request.headers.authorization) {
    try {
      request.jwt = verifyJwt(request.headers.authorization.replace("Bearer ", ""))
    } catch (err) {}
  }

  next()
}

declare module "fastify" {
  export interface FastifyRequest {
    jwt: any
  }
}
