import { FastifyInstance } from "fastify"

import v1 from "routes/v1"

export default function routes(instance: FastifyInstance, opts: any, done: Function) {
  instance.register(v1, { prefix: "/v1" })

  done()
}
