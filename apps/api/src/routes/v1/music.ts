import { randomUUID } from "node:crypto"
import { FastifyInstance } from "fastify"

import {
  YoutubeIdParamsDto,
  GetMusicPramsDto,
  GetMusicQuery,
  SearchMusicQuery,
  BypassMusicParamsDto,
  ConvertMusicBodyDto,
} from "@kmotion/validations"
import {
  ConverterMusicInfo,
  MusicByPassResponse,
  MusicInfoResponse,
  MusicResponse,
  MusicSearchResponse,
  MusicShareResponse,
  MusicSyncResponse,
} from "@kmotion/types"
import { musicMapper } from "@kmotion/mappers"
import YtConverter from "../../services/ytconverter"
import { sha256 } from "../../utils/hash"
import isLogin from "../../middlewares/isLogin"
import isAdmin from "../../middlewares/isAdmin"
import BadRequestException from "../../exceptions/http/BadRequestException"
import NotFoundException from "../../exceptions/http/NotFoundException"
import { connexion } from "../../services/database"
import { Music } from "@kmotion/database/prisma/types"

export default async function musicRoutes(instance: FastifyInstance) {
  const ytConverter = YtConverter.getInstance()

  instance.get<{ Reply: MusicResponse; Querystring: GetMusicQuery }>(
    "/",
    { onRequest: isLogin, preHandler: instance.validateQuery(GetMusicQuery) },
    async (request, reply) => {
      const offset: number = request.query.offset || 0

      const musics = await connexion
        .selectFrom("musics")
        .selectAll()
        .orderBy("created_at", "desc")
        .offset(+offset * 40)
        .limit(40)
        .execute()

      const meta = await connexion
        .selectFrom("musics")
        .select(({ fn }) => [fn.count<number>("musics.id").as("total")])
        .executeTakeFirst()

      return reply.send({
        success: true,
        musics: musicMapper.many(musics),
        meta: { total: meta?.total ?? 0 },
      })
    }
  )

  instance.get<{ Reply: MusicSyncResponse }>(
    "/sync",
    { onRequest: isAdmin },
    async (request, reply) => {
      const musics = await ytConverter.musics()

      const newMusics: Array<Music> = []

      for (const music of musics) {
        const find = await connexion
          .selectFrom("musics")
          .selectAll()
          .where("youtube_id", "=", music.id)
          .executeTakeFirst()

        if (!find) {
          await connexion
            .insertInto("musics")
            .values({
              title: music.title.trim(),
              artist: music.author.trim(),
              youtube_id: music.id,
              downloader_id: request.session.user.id,
              duration: music.duration,
            })
            .executeTakeFirst()
            .then((music) => newMusics.push(music))
        }
      }

      reply.send({ success: true, musics: musicMapper.many(newMusics) })
    }
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
      await connexion
        .selectFrom("musics")
        .where("youtube_id", "=", request.params.youtubeId)
        .executeTakeFirstOrThrow()
        .then(() => {
          throw new BadRequestException("Music already exists")
        })
        .catch(() => void null)

      const response = await ytConverter.download(request.params.youtubeId)

      if (response.status !== 200) throw new BadRequestException("request to converter failed")

      const info: ConverterMusicInfo = await ytConverter.info(request.params.youtubeId)

      const music = await connexion
        .insertInto("musics")
        .values({
          title: info.title,
          artist: info.author.name,
          youtube_id: request.params.youtubeId,
          downloader_id: request.session.user.id,
          duration: 0,
        })
        .executeTakeFirst()

      reply.send({ success: "true", music: musicMapper.one(music), info })
    }
  )

  instance.get<{ Params: GetMusicPramsDto }>(
    "/:id",
    { onRequest: isLogin, preHandler: instance.validateParams(GetMusicPramsDto) },
    async (request, reply) => {
      const music = await connexion
        .selectFrom("musics")
        .selectAll()
        .where("id", "=", +request.params.id)
        .executeTakeFirst()

      if (!music) throw new NotFoundException("Music not found")

      reply.send({ success: true, music: musicMapper.one(music) })
    }
  )

  instance.get<{ Params: GetMusicPramsDto }>(
    "/:id/stream",
    { onRequest: isLogin, preHandler: instance.validateParams(GetMusicPramsDto) },
    async (request, reply) => {
      const music = await connexion
        .selectFrom("musics")
        .selectAll()
        .where("id", "=", +request.params.id)
        .executeTakeFirst()

      if (!music) throw new NotFoundException("Music not found")

      const stream = await ytConverter.stream(music.youtube_id)

      reply
        .headers({
          "Content-Type": "audio/mpeg",
          "Content-Disposition": `attachment; filename="${encodeURIComponent(music.title)}.mp3"`,
        })
        .send(stream)
    }
  )

  instance.get<{ Params: YoutubeIdParamsDto; Reply: MusicInfoResponse }>(
    "/:youtubeId/info",
    { onRequest: isLogin, preHandler: instance.validateParams(YoutubeIdParamsDto) },
    async (request, reply) => {
      const music = await connexion
        .selectFrom("musics")
        .selectAll()
        .where("youtube_id", "=", request.params.youtubeId)
        .executeTakeFirst()

      reply.send({
        success: true,
        music: music ? musicMapper.one(music) : null,
        isReady: !!music,
        info: await ytConverter.info(request.params.youtubeId),
      })
    }
  )

  instance.get<{ Params: GetMusicPramsDto }>(
    "/:id/cover",
    { onRequest: isLogin, preHandler: instance.validateParams(GetMusicPramsDto) },
    async (request, reply) => {
      const music = await connexion
        .selectFrom("musics")
        .selectAll()
        .where("id", "=", +request.params.id)
        .executeTakeFirst()

      if (!music) throw new NotFoundException("Music not found")

      const stream = await ytConverter.cover(music.youtube_id)

      reply
        .headers({
          "Content-Type": "image/jpeg",
          "Content-Disposition": `attachment; filename="${encodeURIComponent(music.title)}.jpg"`,
        })
        .send(stream)
    }
  )

  instance.delete<{ Params: GetMusicPramsDto }>(
    "/:id",
    { onRequest: isLogin, preHandler: instance.validateParams(GetMusicPramsDto) },
    async (request, reply) => {
      const music = await connexion
        .selectFrom("musics")
        .selectAll()
        .where("id", "=", +request.params.id)
        .executeTakeFirst()

      if (!music) throw new NotFoundException("Music not found")

      await connexion.deleteFrom("playlist_entries").where("music_id", "=", music.id).execute()
      await connexion.deleteFrom("musics").where("id", "=", music.id).execute()

      if (process.env.NODE_ENV === "production") await ytConverter.delete(music.youtube_id)

      reply.status(202).send({ success: true })
    }
  )

  instance.get<{ Querystring: SearchMusicQuery; Reply: MusicSearchResponse }>(
    "/search",
    { onRequest: isLogin, preHandler: instance.validateQuery(SearchMusicQuery) },
    async (request, reply) => {
      const query = `%${request.query.q}%`

      const musics = await connexion
        .selectFrom("musics")
        .selectAll("musics")
        .where((qb) => qb.or([qb.cmpr("title", "like", query), qb.cmpr("artist", "like", query)]))
        .execute()

      reply.send({ success: true, musics: musicMapper.many(musics) })
    }
  )

  instance.post<{ Params: GetMusicPramsDto; Reply: MusicShareResponse }>(
    "/:id/share",
    { onRequest: isAdmin, preHandler: instance.validateParams(GetMusicPramsDto) },
    async (request, reply) => {
      const music = await connexion
        .selectFrom("bypass_codes")
        .selectAll()
        .where("id", "=", +request.params.id)
        .executeTakeFirst()

      if (!music) throw new NotFoundException("Music not found")

      const code = await sha256(randomUUID())

      const bypassCode = await connexion
        .insertInto("bypass_codes")
        .values({
          code,
          target_id: music.id.toString(),
          type: "music",
          valid: 1,
          expireAt: new Date(Date.now() + 1000 * 60 * 60 * 4).toString(),
        })
        .executeTakeFirst()

      const link = `${process.env.CLIENT_URL}/out/test/${code}`

      reply.send({ success: true, link: link, music: musicMapper.one(music) })
    }
  )

  instance.get<{ Params: BypassMusicParamsDto; Reply: MusicByPassResponse }>(
    "/bypass/:code",
    async (request, reply) => {
      const code = await connexion
        .selectFrom("bypass_codes")
        .selectAll()
        .where("code", "=", request.params.code)
        .where("valid", "=", 1)
        .where("type", "=", "music")
        .executeTakeFirst()

      if (!code || new Date(code.expireAt).getTime() < Date.now())
        throw new NotFoundException("Bypass code not found")

      const music = await connexion
        .selectFrom("musics")
        .selectAll()
        .where("id", "=", +code.target_id)
        .executeTakeFirst()

      if (!music) throw new NotFoundException("Music not found")

      reply.send({
        success: true,
        music: musicMapper.one(music),
        song: (await ytConverter.stream(music.youtube_id)).toString("base64"),
        cover: (await ytConverter.cover(music.youtube_id)).toString("base64"),
      })
    }
  )
}
