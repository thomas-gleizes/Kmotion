import { FastifyInstance } from "fastify"

import v1 from "routes/v1"
import logger from "plugins/logger"
import exceptionHandler from "plugins/exceptionHandler"

export default function routes(instance: FastifyInstance, opts: any, done: Function) {
  instance.addHook("onRequest", logger)

  instance.register(v1, { prefix: "/v1" })

  instance.setErrorHandler(exceptionHandler)

  done()
}
