import { FastifyReply, FastifyRequest } from "fastify"

export default function bodyParser(request: FastifyRequest, reply: FastifyReply, done: Function) {
  if (request.headers["content-type"] === "application/json")
    request.body = JSON.parse(request.body as any)

  done()
}
