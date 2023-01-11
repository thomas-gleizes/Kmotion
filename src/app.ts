import fastify from "fastify"
import fastifyStatic from "@fastify/static"
import fastifyCookie from "@fastify/cookie"
import fastifySession from "@fastify/session"
import dotenv from "dotenv"
import "reflect-metadata"

import { APP_DIST, APP_PORT } from "utils/constants"
import trace from "utils/trace"
import apiRoutes from "routes"
import propsRoutes from "routes/props"
import pageRoutes from "routes/page"

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
app.register(propsRoutes, { prefix: "props" })
app.register(pageRoutes)

app
  .listen({ port: APP_PORT })
  .then((url) => trace(`Server listening on ${url}`))
  .catch((err) => trace("server crash", err))
