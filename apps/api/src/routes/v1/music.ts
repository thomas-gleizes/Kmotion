import { FastifyInstance } from "fastify"
import { Music } from "@prisma/client"

import isLogin from "../../middlewares/isLogin"
import prisma from "../../services/prisma"
import isAdmin from "../../middlewares/isAdmin"
import YtConverter from "../../services/ytconverter"
import BadRequestException from "../../exceptions/http/BadRequestException"
import NotFoundException from "../../exceptions/http/NotFoundException"
import { DownloadMusicParams, GetMusicParams } from "../../schemas/music"
import { SearchParamsSchema } from "../../schemas/generic"

//JRf3n9XZ5Ms

export default async function musicRoutes(instance: FastifyInstance) {
  instance.addHook("onRequest", isLogin)

  const ytConverter = YtConverter.getInstance()

  instance.get("/sync", { onRequest: [isAdmin] }, async (request, reply) => {
    const musics = await ytConverter.musics()

    const newMusics: Array<Music> = []

    // TODO: BUG have to be fixed
    for (const music of musics) {
      const find = await prisma.music.findUnique({
        where: { youtubeId: music.id },
      })

      if (!find) {
        await prisma.music
          .create({
            data: {
              title: music.title,
              artist: music.author,
              youtubeId: music.id,
              downloaderId: request.session.user.id,
            },
          })
          .then((music) => newMusics.push(music))
          .catch(() => void null)
      }
    }

    reply.send({ success: true, musics: newMusics })
  })

  instance.post<{ Params: DownloadMusicParams }>(
    "/:youtubeId/add",
    { preHandler: instance.validateParams(DownloadMusicParams) },
    async (request, reply) => {
      await prisma.music
        .findUniqueOrThrow({ where: { youtubeId: request.params.youtubeId } })
        .then(() => {
          throw new BadRequestException("Music already exists")
        })
        .catch(() => void null)

      const response = await ytConverter.download(request.params.youtubeId)

      if (response.status !== 200) throw new BadRequestException(response.headers.reason)

      const info = await ytConverter.info(request.params.youtubeId)

      const music = await prisma.music.create({
        data: {
          title: info.title,
          artist: info.author.name,
          youtubeId: request.params.youtubeId,
          downloaderId: request.session.user.id,
        },
      })

      reply.send({ success: "true", music, info })
    }
  )

  instance.get<{ Params: GetMusicParams }>(
    "/:id",
    { preHandler: instance.validateParams(GetMusicParams) },
    async (request, reply) => {
      const music = await prisma.music.findUnique({
        where: { id: +request.params.id },
      })

      if (!music) throw new NotFoundException("Music not found")

      reply.send({ success: true, music })
    }
  )

  instance.get<{ Params: GetMusicParams }>(
    "/:id/stream",
    { preHandler: instance.validateParams(GetMusicParams) },
    async (request, reply) => {
      const music = await prisma.music.findUnique({
        where: { id: request.params.id },
      })

      if (!music) throw new NotFoundException("Music not found")

      const stream = await ytConverter.stream(music.youtubeId)

      reply
        .headers({
          "Content-Type": "audio/mpeg",
          "Content-Disposition": `attachment; filename="${encodeURIComponent(music.title)}.mp3"`,
        })
        .send(stream)
    }
  )

  instance.get<{ Params: GetMusicParams }>(
    "/:id/cover",
    { preHandler: instance.validateParams(GetMusicParams) },
    async (request, reply) => {
      const music = await prisma.music.findUnique({
        where: { id: request.params.id },
      })

      if (!music) throw new NotFoundException("Music not found")

      const stream = await ytConverter.cover(music.youtubeId)

      reply
        .headers({
          "Content-Type": "image/jpeg",
          "Content-Disposition": `attachment; filename="${encodeURIComponent(music.title)}.jpg"`,
        })
        .send(stream)
    }
  )

  instance.delete<{ Params: GetMusicParams }>(
    "/:id",
    { preHandler: instance.validateParams(GetMusicParams) },
    async (request, reply) => {
      const music = await prisma.music.findUnique({
        where: { id: +request.params.id },
      })

      if (!music) throw new NotFoundException("Music not found")

      await Promise.all([
        prisma.music.delete({ where: { id: music.id } }),
        ytConverter.delete(music.youtubeId),
      ])

      reply.status(202).send({ success: true, music })
    }
  )

  instance.get<{ Params: SearchParamsSchema }>(
    "/search/:query",
    { preHandler: instance.validateParams(SearchParamsSchema) },
    async (request, reply) => {
      const musics = await prisma.music.findMany({
        where: {
          OR: [
            { title: { contains: request.params.query } },
            { artist: { contains: request.params.query } },
          ],
        },
      })

      reply.send({ success: true, musics })
    }
  )
}
