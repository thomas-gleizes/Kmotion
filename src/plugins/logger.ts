import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from "fastify"

import trace from "utils/trace"

export default function logger(
  request: FastifyRequest,
  reply: FastifyReply,
  next: HookHandlerDoneFunction
) {
  void trace(`(${request.ip}) ${request.method} ${request.url}`)
  next()
}
