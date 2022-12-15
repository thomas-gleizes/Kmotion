import { FastifyInstance } from "fastify"
import { Visibility } from "@prisma/client"

import isLogin from "middlewares/isLogin"
import isAdmin from "middlewares/isAdmin"
import prisma from "utils/prisma"
import { generateJwt } from "utils/jwt"
import NotFoundException from "exceptions/http/NotFoundException"

export default function userRoutes(instance: FastifyInstance, opts: any, done: Function) {
  instance.addHook("onRequest", isLogin)

  instance.get("/me", async (request, reply) => {
    reply.send({ success: true, user: request.user })
  })

  instance.get("/", { onRequest: [isAdmin] }, async (request, reply) => {
    const users = await prisma.user.findMany()

    reply.send({
      success: true,
      users: users.map(({ password, ...user }) => user)
    })
  })

  instance.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const visiblities: Visibility[] = ["public"]
    if (request.user.isAdmin) visiblities.push("private")

    const user = await prisma.user.findUnique({
      where: { id: +request.params.id }
    })

    if (!user || visiblities.includes(user.visibility))
      throw new NotFoundException("User not found")

    reply.send({ success: true, user })
  })

  instance.patch<{ Params: { id: string }; Body: { name: string; visibility: Visibility } }>(
    "/",
    async (request, reply) => {
      const user = await prisma.user.update({
        where: {
          id: request.user.id
        },
        data: {
          name: request.body.name,
          slug: request.body.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
          visibility: request.body.visibility
        }
      })

      reply.send({ success: true, user, token: generateJwt(user) })
    }
  )

  instance.patch<{ Params: { id: string } }>(
    "/:id/activate",
    { onRequest: [isAdmin] },
    async (request, reply) => {
      const user = await prisma.user.update({
        where: { id: +request.params.id },
        data: { isActivate: true }
      })

      reply.status(200).send({ success: true, user })
    }
  )

  instance.get<{ Params: { id: string } }>("/:id/playlists", async (request, reply) => {
    const visibilities: Visibility[] = ["public"]
    if (request.user.id === +request.params.id || request.user.isAdmin) visibilities.push("private")

    const user = await prisma.user.findUnique({
      where: { id: +request.params.id }
    })

    if (!user || !visibilities.includes(user.visibility))
      throw new NotFoundException("User not found")

    const playlists = await prisma.playlist.findMany({
      where: { authorId: +request.params.id, visibility: { in: visibilities } }
    })

    reply.send({ success: true, playlists })
  })

  done()
}
