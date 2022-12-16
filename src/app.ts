import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import fastify from "fastify"
import fastifyStatic from "@fastify/static"
import dotenv from "dotenv"

import routes from "routes"
import trace from "utils/trace"

dotenv.config()

const PORT: number = Number(process.env.PORT) || 8000
const rootDir = dirname(dirname(fileURLToPath(import.meta.url)))

const app = fastify()

app.register(fastifyStatic, { root: join(rootDir, "public"), prefix: "/public" })

app.register(routes, { prefix: "/api" })

app
  .listen({ port: PORT })
  .then((url) => trace(`Server listening on ${url}`))
  .catch((err) => trace("server crash", err))
