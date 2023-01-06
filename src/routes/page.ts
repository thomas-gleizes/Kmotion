import { FastifyInstance } from "fastify"

import renderApp from "client/server"
import routes from "client/routes"
import logger from "plugins/logger"

export default function page(instance: FastifyInstance, opts: any, done: Function) {
  instance.addHook("onRequest", logger)

  for (const route of routes) {
    instance.get(route.path, async (request, reply) => {
      const html = await renderApp(route, request, reply)
      reply.type("text/html").send(html)
    })
  }

  done()
}
