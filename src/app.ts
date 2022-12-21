import { join } from "node:path"

import fastify from "fastify"
import fastifyStatic from "@fastify/static"
import fastifyCookie from "@fastify/cookie"

import dotenv from "dotenv"

import routes from "routes"
import trace from "utils/trace"
import render from "plugins/render"
import { APP_DIST, APP_PORT } from "utils/constants"

dotenv.config()

const app = fastify()

app.register(fastifyStatic, {
  root: join(APP_DIST, "static"),
  prefix: "/static",
  decorateReply: false
})
app.register(fastifyStatic, {
  root: join(APP_DIST, "public"),
  prefix: "/public",
  decorateReply: false
})

app.register(fastifyCookie)
app.register(routes, { prefix: "/api" })
app.register(render)

app
  .listen({ port: APP_PORT })
  .then((url) => trace(`Server listening on ${url}`))
  .catch((err) => trace("server crash", err))
