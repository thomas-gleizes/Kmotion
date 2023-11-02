import { FastifyInstance } from "fastify"
import { Visibility } from "@prisma/client"

import { userMapper } from "@kmotion/mappers"
import isLogin from "../../middlewares/isLogin"
import isAdmin from "../../middlewares/isAdmin"
import prisma from "../../services/prisma"
import NotFoundException from "../../exceptions/http/NotFoundException"
import { IdNumberDto } from "@kmotion/validations"

export default async function userRoutes(instance: FastifyInstance) {
  instance.addHook("onRequest", isLogin)

  instance.get("/me", async (request, reply) => {
    reply.send({ success: true, user: request.session.user })
  })

  instance.get("/", { onRequest: [isAdmin] }, async (request, reply) => {
    const users = await prisma.user.findMany()

    reply.send({
      success: true,
      users: userMapper.many(users),
    })
  })

  instance.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const visiblities: Visibility[] = ["public"]
    if (request.session.user.isAdmin) visiblities.push("private")

    const user = await prisma.user.findUnique({
      where: { id: +request.params.id },
    })

    if (!user || visiblities.includes(user.visibility))
      throw new NotFoundException("User not found")

    reply.send({ success: true, user: userMapper.one(user) })
  })

  instance.patch<{
    Params: { id: string }
    Body: { name: string; visibility: Visibility }
  }>("/", async (request, reply) => {
    const user = await prisma.user
      .update({
        where: {
          id: request.session.user.id,
        },
        data: {
          name: request.body.name,
          slug: request.body.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
          visibility: request.body.visibility,
        },
      })
      .then((user) => userMapper.one(user))

    request.session.user = user

    reply.send({ success: true, user })
  })

  instance.patch<{ Params: IdNumberDto }>(
    "/:id/activate",
    { onRequest: [isAdmin], preHandler: instance.validateParams(IdNumberDto) },
    async (request, reply) => {
      const user = await prisma.user.update({
        where: { id: request.params.id },
        data: { isActivate: true },
      })

      reply.status(200).send({ success: true, user: userMapper.one(user) })
    },
  )

  instance.patch<{ Params: IdNumberDto }>(
    "/:id/deactivate",
    { onRequest: [isAdmin], preHandler: instance.validateParams(IdNumberDto) },
    async (request, reply) => {
      console.log("Ici")

      const user = await prisma.user.update({
        where: { id: request.params.id },
        data: { isActivate: false },
      })

      reply.status(200).send({ success: true, user: userMapper.one(user) })
    },
  )

  instance.get<{ Params: { id: string } }>("/:id/playlists", async (request, reply) => {
    const visibilities: Visibility[] = ["public"]
    if (request.session.user.id === +request.params.id || request.session.user.isAdmin)
      visibilities.push("private")

    const user = await prisma.user.findUnique({
      where: { id: +request.params.id },
    })

    if (!user || !visibilities.includes(user.visibility))
      throw new NotFoundException("User not found")

    const playlists = await prisma.playlist.findMany({
      where: {
        authorId: +request.params.id,
        visibility: { in: visibilities },
      },
    })

    reply.send({ success: true, playlists })
  })
}
