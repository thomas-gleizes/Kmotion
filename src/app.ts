import fastify from "fastify"
import dotenv from "dotenv"

import routes from "routes"
import trace from "utils/trace"

dotenv.config()

const PORT: number = Number(process.env.PORT) || 8000

const app = fastify()

app.register(routes, { prefix: "/api" })

app
  .listen({ port: PORT })
  .then((url) => trace(`Server listening on ${url}`))
  .catch((err) => trace("server crash", err))
