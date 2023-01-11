import { FastifyInstance } from "fastify"
import logger from "plugins/logger"
import routes from "client/routes"
import generateRouter from "client/utils/generateRouter"

export default function propsRoutes(instance: FastifyInstance, opts: any, done: Function) {
  instance.addHook("preHandler", logger)


  for (const route of generateRouter(routes))
    instance.get(route.path, (request, reply) => {
      console.log(request.url, route.path)

      reply.send({ success: true })
    })

  done()
}
