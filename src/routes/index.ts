import { FastifyInstance } from "fastify"
import fastifySession from "@fastify/session"

import v1 from "routes/v1"
import logger from "plugins/logger"
import exceptionHandler from "plugins/exceptionHandler"

export default function routes(instance: FastifyInstance, opts: any, done: Function) {
  instance.addHook("onRequest", logger)

  instance.register(fastifySession, { secret: process.env.SECRET_SESSION as string })
  instance.register(v1, { prefix: "/v1" })

  instance.setErrorHandler(exceptionHandler)

  done()
}
