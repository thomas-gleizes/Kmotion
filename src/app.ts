import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import fastify from "fastify"
import dotenv from "dotenv"

import routes from "routes"
import trace from "utils/trace"
import render from "plugins/render"
import fastifyStatic from "@fastify/static"

dotenv.config()

const PORT: number = Number(process.env.PORT) || 8000
const ROOT_DIR = dirname(dirname(fileURLToPath(import.meta.url)))

const app = fastify()

app.register(fastifyStatic, {
  root: join(ROOT_DIR, "dist/static"),
  prefix: "/static",
  decorateReply: false
})
app.register(fastifyStatic, {
  root: join(ROOT_DIR, "public"),
  prefix: "/public",
  decorateReply: false
})

app.register(routes, { prefix: "/api" })
app.register(render)

app
  .listen({ port: PORT })
  .then((url) => trace(`Server listening on ${url}`))
  .catch((err) => trace("server crash", err))
