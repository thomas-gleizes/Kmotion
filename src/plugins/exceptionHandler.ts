import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify"
import HttpException from "exceptions/http/HttpException"
import Exception from "exceptions/Exception"
import trace from "utils/trace"
import * as process from "process"

export default function exceptionHandler(
  this: FastifyInstance,
  exception: Exception,
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (exception instanceof HttpException) {
    void trace("http exception", exception.status, exception.message)
    return reply.status(exception.status).send(exception.toJSON())
  }

  if (process.env.NODE_ENV !== "production") {
    void trace("Development exception", exception)
    return reply
      .status(500)
      .send({ success: false, message: exception.message, stack: exception.stack })
  }

  void trace("Production Error", exception)
  return reply.status(500).send({ success: true, message: "Internal Server Error" })
}
