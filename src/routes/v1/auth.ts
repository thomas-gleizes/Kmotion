import { FastifyInstance, FastifyRequest } from "fastify"

import prisma from "utils/prisma"
import NotFoundException from "exceptions/http/NotFoundException"
import { LoginSchema } from "schemas/auth"

export default function authRoutes(instance: FastifyInstance, opts: any, done: Function) {
  instance.post(
    "/login",
    { schema: { body: LoginSchema } },
    async (request: FastifyRequest<{ Body: LoginSchema }>, reply) => {
      const user = await prisma.user.findUnique({
        where: {
          email: request.body.email
        }
      })

      if (!user) throw new NotFoundException("User not found")

      reply.send({ success: true, user })
    }
  )

  done()
}
