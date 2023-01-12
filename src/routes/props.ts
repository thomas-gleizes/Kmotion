import { FastifyInstance } from "fastify"

import logger from "plugins/logger"
import routes from "client/routes"
import generateRouter from "client/utils/generateRouter"
import NotFoundException from "exceptions/http/NotFoundException"

export default function propsRoutes(instance: FastifyInstance, opts: any, done: Function) {
  instance.addHook("preHandler", logger)

  instance.get("*", async (request, reply) => {
    const router = generateRouter(routes, "/props")

    for (const route of router) {
      if (
        route.path === request.url &&
        typeof route.page.props.Page.serverSideProps === "function"
      ) {
        const props = await route.page.props.Page.serverSideProps(request, reply)

        console.log("Props", props)

        return reply.send({ success: true, props })
      }
    }

    throw new NotFoundException("This page have no server props")
  })

  done()
}
