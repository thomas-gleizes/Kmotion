import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify"
import HttpException from "exceptions/http/HttpException"
import Exception from "exceptions/Exception"
import trace from "utils/trace"
import * as process from "process"

export default function exceptionHandler(
  this: FastifyInstance,
  error: Exception,
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof HttpException) {
    void trace("http exception", error)
    return reply.status(error.status).send({ success: false, message: error.message })
  }

  console.log("Error", error)

  if (process.env.NODE_ENV !== "production") {
    void trace("Development error", error)
    return reply.status(500).send({ success: false, message: error.message, stack: error.stack })
  }

  void trace("Production Error", error)
  return reply.status(500).send({ success: true, message: "Internal Server Error" })
}
