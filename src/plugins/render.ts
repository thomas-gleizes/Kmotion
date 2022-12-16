import { FastifyInstance } from "fastify"
import renderApp from "../client/server"

// import renderApp from "client/server"
// import routes from "client/routes"

export default function render(instance: FastifyInstance, opts: any, done: Function) {
  instance.get("/", async (request, reply) => {
    const html = await renderApp(null, request, reply)
    reply.type("text/html").send(html)
  })

  // for (const route of routes) {
  //   instance.get(route.path, async (request, reply) => {
  //     console.log("RENDERING", route.path)
  //
  //     try {
  //       const html = await renderApp(route, request, reply)
  //       reply.type("text/html").send(html)
  //     } catch (err) {
  //       reply.status(404).send("not found")
  //     }
  //   })
  // }

  done()
}
