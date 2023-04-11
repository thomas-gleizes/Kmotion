import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from "fastify"

import hash from "../utils/hash"

export default function logger(
  request: FastifyRequest,
  reply: FastifyReply,
  next: HookHandlerDoneFunction
) {
  const log = `(${request.ip}) ${request.method} ${request.url}`

  void hash(log)
  next()
}
