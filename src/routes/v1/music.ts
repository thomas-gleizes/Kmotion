import { FastifyInstance } from "fastify"
import isLogin from "middlewares/isLogin"

export default function musicRoutes(instance: FastifyInstance, options: any, done: Function) {
  instance.addHook("onRequest", isLogin)

  instance.post<{ Params: { id: string } }>("/add", async (request, reply) => {})

  done()
}
