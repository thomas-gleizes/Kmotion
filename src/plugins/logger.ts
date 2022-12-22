import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from "fastify"

import trace from "utils/trace"

export default function logger(
  request: FastifyRequest,
  reply: FastifyReply,
  next: HookHandlerDoneFunction
) {
  let log = `(${request.ip}) ${request.method} ${request.url}`

  void trace(log)
  next()
}
