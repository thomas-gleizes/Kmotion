import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify"

import HttpException from "../exceptions/http/HttpException"
import hash from "../utils/hash"

export default function exceptionHandler(
  this: FastifyInstance,
  exception: Error,
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (exception instanceof HttpException) {
    void hash("http exception", exception.status.toString(), exception.message)
    return reply.status(exception.status).send(exception.toJSON())
  }

  if (process.env.NODE_ENV !== "production") {
    void hash("Development exception", exception.message, exception.stack?.toString())
    return reply
      .status(500)
      .send({ success: false, message: exception.message, stack: exception.stack })
  }

  void hash("Production Error", exception.message, exception.stack?.toString())
  return reply.status(500).send({ success: true, message: "Internal Server Error" })
}
