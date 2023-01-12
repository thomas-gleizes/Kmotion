import { FastifyInstance } from "fastify"

import logger from "plugins/logger"
import routes from "client/routes"
import generateRouter from "client/utils/generateRouter"
import renderApp from "client/server"

export default function page(instance: FastifyInstance, opts: any, done: Function) {
  instance.addHook("onRequest", logger)

  const router = generateRouter(routes)

  for (const route of router) {
    instance.get(route.path, async (request, reply) => {
      reply.type("text/html").send(await renderApp(route, request, reply))
    })
  }

  done()
}
