import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from "fastify"

import trace from "../utils/trace"

const BAN_ROUTES = ["GET:/api/v1/musics/:id/cover", "GET:/api/v1/musics/:id/stream"]

export default function logger(
  request: FastifyRequest,
  reply: FastifyReply,
  next: HookHandlerDoneFunction,
) {
  const log = `(${request.ip}) ${request.method} ${request.url}`

  if (!BAN_ROUTES.includes(`${request.method}:${request.routerPath}`)) {
    void trace(log)
  }

  next()
}
