import { DoneFuncWithErrOrRes, FastifyInstance } from "fastify"
import fastifyStatic, { FastifyStaticOptions } from "@fastify/static"

export default async function staticRoutes(
  instance: FastifyInstance,
  options: FastifyStaticOptions,
  done: DoneFuncWithErrOrRes
) {
  instance.register(fastifyStatic, options)

  done()
}
