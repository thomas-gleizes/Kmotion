import { FastifyInstance } from "fastify"
import { Music } from "@prisma/client"

import isLogin from "middlewares/isLogin"
import prisma from "services/prisma"
import isAdmin from "middlewares/isAdmin"
import YtConverter from "services/ytconverter"
import BadRequestException from "exceptions/http/BadRequestException"
import NotFoundException from "exceptions/http/NotFoundException"

//JRf3n9XZ5Ms

export default function musicRoutes(instance: FastifyInstance, options: any, done: Function) {
  instance.addHook("onRequest", isLogin)

  const ytConverter = YtConverter.getInstance()

  instance.get("/sync", { onRequest: [isAdmin] }, async (request, reply) => {
    const musics = await ytConverter.musics()

    const newMusics: Array<Music> = []

    for (const music of musics) {
      const find = await prisma.music.findUnique({ where: { youtubeId: music.id } })

      if (!find) {
        await prisma.music
          .create({
            data: {
              title: music.title,
              artist: music.author,
              youtubeId: music.id,
              downloaderId: request.session.user.id
            }
          })
          .then((music) => newMusics.push(music))
          .catch((error) => console.log("err", error))
      }
    }

    reply.send({ success: true, musics: newMusics })
  })

  instance.post<{ Params: { youtubeId: string } }>("/:youtubeId/add", async (request, reply) => {
    await prisma.music
      .findUniqueOrThrow({ where: { youtubeId: request.params.youtubeId } })
      .then(() => {
        throw new BadRequestException("Music already exists")
      })
      .catch(() => {})

    const response = await ytConverter.download(request.params.youtubeId)

    if (response.status !== 200) throw new BadRequestException(response.headers.reason)

    const info = await ytConverter.info(request.params.youtubeId)

    const music = await prisma.music.create({
      data: {
        title: info.title,
        artist: info.author.name,
        youtubeId: request.params.youtubeId,
        downloaderId: request.session.user.id
      }
    })

    reply.send({ success: "true", music, info })
  })

  instance.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const music = await prisma.music.findUnique({ where: { id: +request.params.id } })

    if (!music) throw new NotFoundException("Music not found")

    reply.send({ success: true, music })
  })

  instance.get<{ Params: { id: string } }>("/:id/stream", async (request, reply) => {
    const music = await prisma.music.findUnique({ where: { id: +request.params.id } })

    if (!music) throw new NotFoundException("Music not found")

    const stream = await ytConverter.stream(music.youtubeId)

    reply.type("audio/mpeg")
    reply.send(stream)
  })

  instance.get<{ Params: { id: string } }>("/:id/cover", async (request, reply) => {
    const music = await prisma.music.findUnique({ where: { id: +request.params.id } })

    if (!music) throw new NotFoundException("Music not found")

    const stream = await ytConverter.cover(music.youtubeId)

    reply.type("image/jpeg")
    reply.send(stream)
  })

  instance.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const music = await prisma.music.findUnique({ where: { id: +request.params.id } })

    if (!music) throw new NotFoundException("Music not found")

    await Promise.all([
      prisma.music.delete({ where: { id: music.id } }),
      ytConverter.delete(music.youtubeId)
    ])

    reply.status(202).send({ success: true, music })
  })

  done()
}
