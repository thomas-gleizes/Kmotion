import { FastifyInstance } from "fastify"

import authRoutes from "routes/v1/auth"

export default function v1(instance: FastifyInstance, opts: any, done: Function) {
  instance.register(authRoutes, { prefix: "/auth" })

  done()
}
