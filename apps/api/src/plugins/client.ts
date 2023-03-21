import { FastifyInstance } from "fastify"
import fastifyStatic from "@fastify/static"
import { APP_PUBLIC } from "../utils/constants"

export async function clientPlugin(instance: FastifyInstance): Promise<void> {
  return void instance
    .register(fastifyStatic, { root: APP_PUBLIC, prefix: "/" })
    .setNotFoundHandler((req, res) => {
      res.sendFile("index.html")
    })
}
