import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import isAuth from "middlewares/isAuth"
import isAdmin from "middlewares/isAdmin"
import prisma from "utils/prisma"

export default function userRoutes(instance: FastifyInstance, opts: any, done: Function) {
  instance.get("/me", { onRequest: [isAuth] }, async (request, reply) => {
    reply.send({ success: true, user: request.user })
  })

  instance.get("/", { onRequest: [isAdmin] }, async (request, reply) => {
    const users = await prisma.user.findMany()

    reply.send({
      success: true,
      users: users.map(({ password, ...user }) => user)
    })
  })

  instance.patch(
    "/:id/activate",
    { onRequest: [isAdmin] },
    // @ts-ignore
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const user = await prisma.user.update({
        where: { id: +request.params.id },
        data: { isActivate: true }
      })

      reply.status(200).send({ success: true, user })
    }
  )

  done()
}
