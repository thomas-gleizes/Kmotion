import { FastifyInstance } from "fastify"
import renderApp from "client/server"
import routes from "client/routes"

// import renderApp from "client/server"
// import routes from "client/routes"

export default function render(instance: FastifyInstance, opts: any, done: Function) {
  for (const route of routes) {
    instance.get(route.path, async (request, reply) => {
      const html = await renderApp(route, request, reply)
      reply.type("text/html").send(html)
    })
  }

  done()
}
