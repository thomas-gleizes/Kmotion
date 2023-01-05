import fastify from "fastify"
import fastifyStatic from "@fastify/static"
import fastifyCookie from "@fastify/cookie"
import fastifySession from "@fastify/session"
import dotenv from "dotenv"
import "reflect-metadata"

import { APP_DIST, APP_PORT } from "utils/constants"
import trace from "utils/trace"
import pageRoutes from "plugins/render"
import apiRoutes from "routes"

dotenv.config()

const app = fastify()

app.register(fastifyStatic, {
  root: `${APP_DIST}/static`,
  prefix: "/static",
  decorateReply: false
})
app.register(fastifyStatic, {
  root: `${APP_DIST}/public`,
  prefix: "/public",
  decorateReply: false
})

app.register(fastifyCookie)
app.register(fastifySession, {
  secret: process.env.SECRET_SESSION as string,
  cookieName: "kmotion",
  cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 360, secure: false }
})
app.register(apiRoutes, { prefix: "/api" })
app.register(pageRoutes)

app
  .listen({ port: APP_PORT })
  .then((url) => trace(`Server listening on ${url}`))
  .catch((err) => trace("server crash", err))
