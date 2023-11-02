import { randomUUID } from "node:crypto"
import { FastifyInstance } from "fastify"
import { Music } from "@prisma/client"

import {
  YoutubeIdParamsDto,
  GetMusicPramsDto,
  GetMusicQuery,
  SearchMusicQuery,
  BypassMusicParamsDto,
  ConvertMusicBodyDto,
} from "@kmotion/validations"
import {
  MusicByPassResponse,
  MusicInfoResponse,
  MusicResponse,
  MusicSearchResponse,
  MusicShareResponse,
  MusicSyncResponse,
} from "@kmotion/types"
import { musicMapper } from "@kmotion/mappers"
import YtConverter from "../../services/ytconverter"
import prisma from "../../services/prisma"
import { sha256 } from "../../utils/hash"
import isLogin from "../../middlewares/isLogin"
import isAdmin from "../../middlewares/isAdmin"
import BadRequestException from "../../exceptions/http/BadRequestException"
import NotFoundException from "../../exceptions/http/NotFoundException"

export default async function musicRoutes(instance: FastifyInstance) {
  const ytConverter = YtConverter.getInstance()

  instance.get<{ Reply: MusicResponse; Querystring: GetMusicQuery }>(
    "/",
    { onRequest: isLogin, preHandler: instance.validateQuery(GetMusicQuery) },
    async (request, reply) => {
      const offset: number = request.query.offset || 0

      const musics = await prisma.music.findMany({
        orderBy: { createdAt: "desc" },
        skip: +offset * 40,
        take: 40,
      })
      const total = await prisma.music.count()

      return reply.send({ success: true, musics: musicMapper.many(musics), meta: { total } })
    },
  )

  instance.get<{ Reply: MusicSyncResponse }>(
    "/sync",
    { onRequest: isAdmin },
    async (request, reply) => {
      const musics = await ytConverter.musics()

      const newMusics: Array<Music> = []

      for (const music of musics) {
        const find = await prisma.music.findUnique({
          where: { youtubeId: music.id },
        })

        if (!find) {
          await prisma.music
            .create({
              data: {
                title: music.title.trim(),
                artist: music.author.trim(),
                youtubeId: music.id,
                downloaderId: request.session.user.id,
                duration: music.duration,
                channel: music.channel,
              },
            })
            .then((music) => newMusics.push(music))
        } else {
          await prisma.music.update({
            where: { id: find.id },
            data: {
              title: music.title.trim(),
              artist: music.author.trim(),
              duration: music.duration,
              channel: music.channel,
            },
          })
        }
      }

      reply.send({ success: true, musics: musicMapper.many(newMusics) })
    },
  )

  instance.post<{ Params: YoutubeIdParamsDto; Body: ConvertMusicBodyDto }>(
    "/:youtubeId/add",
    {
      onRequest: isLogin,
      preHandler: [
        instance.validateParams(YoutubeIdParamsDto),
        instance.validateBody(ConvertMusicBodyDto),
      ],
    },
    async (request, reply) => {
      await prisma.music
        .findUniqueOrThrow({ where: { youtubeId: request.params.youtubeId } })
        .then(() => {
          throw new BadRequestException("Music already exists")
        })
        .catch(() => void null)

      const { music: musicConverted } = await ytConverter.download(request.params.youtubeId)

      const music = await prisma.music.create({
        data: {
          title: musicConverted.title.trim(),
          artist: musicConverted.author.trim(),
          youtubeId: request.params.youtubeId,
          downloaderId: request.session.user.id,
          duration: musicConverted.duration,
          channel: musicConverted.channel.trim(),
        },
      })

      reply.send({ success: "true", music: musicMapper.one(music) })
    },
  )

  instance.get<{ Params: GetMusicPramsDto }>(
    "/:id",
    { onRequest: isLogin, preHandler: instance.validateParams(GetMusicPramsDto) },
    async (request, reply) => {
      const music = await prisma.music.findUnique({
        where: { id: +request.params.id },
      })

      if (!music) throw new NotFoundException("Music not found")

      reply.send({ success: true, music: musicMapper.one(music) })
    },
  )

  instance.get<{ Params: GetMusicPramsDto }>(
    "/:id/stream",
    { onRequest: isLogin, preHandler: instance.validateParams(GetMusicPramsDto) },
    async (request, reply) => {
      const music = await prisma.music.findUnique({
        where: { id: request.params.id },
      })

      if (!music) throw new NotFoundException("Music not found")

      const buffer = await ytConverter.stream(music.youtubeId)

      reply
        .headers({
          "Content-Type": "audio/mpeg",
          "Content-Disposition": `attachment; filename="${encodeURIComponent(music.title)}.mp3"`,
        })
        .send(buffer)

      // const buffer = await ytConverter.stream(music.youtubeId)
      // const stream = new Readable({
      //   read() {
      //     this.push(buffer)
      //     this.push(null)
      //   },
      // })
      //
      // reply.type("audio/mpeg")
      // reply.send(stream)
    },
  )

  instance.get<{ Params: YoutubeIdParamsDto; Reply: MusicInfoResponse }>(
    "/:youtubeId/info",
    { onRequest: isLogin, preHandler: instance.validateParams(YoutubeIdParamsDto) },
    async (request, reply) => {
      const music = await prisma.music.findUnique({
        where: { youtubeId: request.params.youtubeId },
      })

      const info = await ytConverter.info(request.params.youtubeId)

      reply.send({
        success: true,
        music: music ? musicMapper.one(music) : null,
        isReady: !!music,
        info: info,
      })
    },
  )

  instance.get<{ Params: GetMusicPramsDto }>(
    "/:id/cover",
    { onRequest: isLogin, preHandler: instance.validateParams(GetMusicPramsDto) },
    async (request, reply) => {
      const music = await prisma.music.findUnique({
        where: { id: request.params.id },
      })

      if (!music) throw new NotFoundException("Music not found")

      const stream = await ytConverter.cover(music.youtubeId)

      reply
        .headers({
          "Content-Type": "image/webp",
          "Content-Disposition": `attachment; filename="${encodeURIComponent(music.title)}.webp"`,
        })
        .send(stream)
    },
  )

  instance.delete<{ Params: GetMusicPramsDto }>(
    "/:id",
    { onRequest: isLogin, preHandler: instance.validateParams(GetMusicPramsDto) },
    async (request, reply) => {
      const music = await prisma.music.findUnique({
        where: { id: +request.params.id },
      })

      if (!music) throw new NotFoundException("Music not found")

      await prisma.playlistEntry.deleteMany({ where: { musicId: music.id } })
      await prisma.music.delete({ where: { id: music.id } })

      if (process.env.NODE_ENV === "production") {
        await ytConverter.delete(music.youtubeId)
      }

      reply.status(202).send({ success: true })
    },
  )

  instance.get<{ Querystring: SearchMusicQuery; Reply: MusicSearchResponse }>(
    "/search",
    { onRequest: isLogin, preHandler: instance.validateQuery(SearchMusicQuery) },
    async (request, reply) => {
      const musics = await prisma.music.findMany({
        where: {
          OR: [
            { title: { contains: `%${request.query.q}%` } },
            { artist: { contains: `%${request.query.q}%` } },
            { channel: { contains: `%${request.query.q}%` } },
          ],
        },
      })

      reply.send({ success: true, musics: musicMapper.many(musics) })
    },
  )

  instance.post<{ Params: GetMusicPramsDto; Reply: MusicShareResponse }>(
    "/:id/share",
    { onRequest: isAdmin, preHandler: instance.validateParams(GetMusicPramsDto) },
    async (request, reply) => {
      const music = await prisma.music.findUnique({ where: { id: +request.params.id } })

      if (!music) throw new NotFoundException("Music not found")

      const bypassCode = await prisma.bypassCode.create({
        data: {
          code: await sha256(randomUUID()),
          targetId: music.id.toString(),
          type: "music",
          valid: true,
          expireAt: new Date(Date.now() + 1000 * 60 * 60 * 4),
        },
      })

      const link = `${process.env.CLIENT_URL}/out/test/${bypassCode.code}`

      reply.send({ success: true, link: link, music: musicMapper.one(music) })
    },
  )

  instance.get<{ Params: BypassMusicParamsDto; Reply: MusicByPassResponse }>(
    "/bypass/:code",
    async (request, reply) => {
      const code = await prisma.bypassCode.findFirst({
        where: {
          code: request.params.code,
          valid: true,
          type: "music",
        },
      })

      if (!code || new Date(code.expireAt).getTime() < Date.now())
        throw new NotFoundException("Bypass code not found")

      const music = await prisma.music.findUnique({ where: { id: +code.targetId } })

      if (!music) throw new NotFoundException("Music not found")

      reply.send({
        success: true,
        music: musicMapper.one(music),
        song: (await ytConverter.stream(music.youtubeId)).toString("base64"),
        cover: (await ytConverter.cover(music.youtubeId)).toString("base64"),
      })
    },
  )
}
