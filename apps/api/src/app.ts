import fastify from "fastify"
import fastifyCookie from "@fastify/cookie"
import fastifySession from "@fastify/session"
import fastifyCors from "@fastify/cors"

import "reflect-metadata"

import { APP_PORT } from "./utils/constants"
import { clientPlugin } from "./plugins/client"
import { jobsPlugins } from "./plugins/jobsPlugins"
import hash from "./utils/hash"
import apiRoutes from "./routes"

const app = fastify()

app.register(fastifyCors, { origin: "*" })
app.register(fastifyCookie)
app.register(fastifySession, {
  secret: process.env.SECRET_SESSION as string,
  cookieName: "kmotion",
  cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 360, secure: false },
})

app.register(jobsPlugins)
app.register(clientPlugin)
app.register(apiRoutes, { prefix: "/api" })

app
  .listen({ port: APP_PORT })
  .then((url) => hash(`Server listening on ${url}`))
  .catch((err) => hash("server crash", err))
