import { FastifyInstance } from "fastify"
import { Visibility } from "@prisma/client"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/index.js"

import prisma from "utils/prisma"
import isLogin from "middlewares/isLogin"
import isAdmin from "middlewares/isAdmin"
import { CreatePlaylistSchema } from "schemas/playlist"
import NotFoundException from "exceptions/http/NotFoundException"

export default function playlistRoutes(instance: FastifyInstance, options: any, done: Function) {
  instance.addHook("onRequest", isLogin)

  instance.post<{ Body: CreatePlaylistSchema }>("/", async (request, reply) => {
    const playlist = await prisma.playlist.create({
      data: {
        title: request.body.title,
        slug: request.body.title.toLowerCase().replace(/\s/g, "-"),
        description: request.body.description,
        authorId: request.user.id,
        visibility: request.body.visibility
      }
    })

    reply.status(201).send({ success: true, playlist })
  })

  instance.get("/", { onRequest: [isAdmin] }, async (request, reply) => {
    const playlists = await prisma.playlist.findMany()

    reply.send({ success: true, playlists })
  })

  instance.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const visiblities: Visibility[] = ["public"]

    const playlist = await prisma.playlist.findUnique({ where: { id: +request.params.id } })

    if (!playlist) throw new NotFoundException("Playlist not found")
    if (request.user.isAdmin || playlist.authorId === request.user.id) visiblities.push("private")
    if (!visiblities.includes(playlist.visibility))
      throw new NotFoundException("Playlist not found")

    reply.send({ success: true, playlist })
  })

  instance.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      const playlist = await prisma.playlist.findUnique({ where: { id: +request.params.id } })

      if (!playlist) throw new NotFoundException("Playlist not found")

      if (!request.user.isAdmin && !(playlist.authorId === +request.user.id))
        throw new NotFoundException("Playlist not found")

      await prisma.playlist.delete({ where: { id: playlist.id } })

      reply.send({ success: true, playlist })
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError)
        if (err.code === "P2025") throw new NotFoundException("Playlist not found")

      throw err
    }
  })

  done()
}
