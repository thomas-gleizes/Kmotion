import { FastifyInstance } from "fastify"
import { Prisma, Visibility } from "@prisma/client"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

import {
  AddMusicToPlaylistDto,
  CreatePlaylistDto,
  GetPlaylistParamsDto,
  QueryGetPlaylist,
  SearchMusicQuery,
  UpdatePlaylistDto,
} from "@kmotion/validations"
import { PlaylistEntriesResponse, PrismaEntry } from "@kmotion/types"
import { entryMapper, playlistMapper } from "@kmotion/mappers"
import prisma from "../../services/prisma"
import isLogin from "../../middlewares/isLogin"
import NotFoundException from "../../exceptions/http/NotFoundException"

export default async function playlistRoutes(instance: FastifyInstance) {
  instance.addHook("onRequest", isLogin)

  instance.post<{ Body: CreatePlaylistDto }>(
    "/",
    { preHandler: instance.validateBody(CreatePlaylistDto) },
    async (request, reply) => {
      const playlist = await prisma.playlist.create({
        data: {
          title: request.body.title,
          slug: request.body.title.toLowerCase().replace(/\s/g, "-"),
          description: request.body.description,
          authorId: request.session.user.id,
          visibility: request.body.visibility,
          entries: {
            create: (request.body.musics || []).map((music, index) => ({
              musicId: music,
              position: index,
            })),
          },
        },
      })

      reply.status(201).send({ success: true, playlist: playlistMapper.one(playlist) })
    },
  )

  instance.get<{ Querystring: QueryGetPlaylist }>("/", async (request, reply) => {
    const include = { entries: false }
    if (request.query.entries) include.entries = true

    const playlists = await prisma.playlist.findMany({
      where: { authorId: request.session.user.id },
      include,
    })

    reply.send({ success: true, playlists: playlistMapper.many(playlists) })
  })

  instance.get<{ Params: GetPlaylistParamsDto; Querystring: QueryGetPlaylist }>(
    "/:id",
    { preHandler: instance.validateParams(GetPlaylistParamsDto) },
    async (request, reply) => {
      const visiblities: Visibility[] = ["public"]

      const include: Prisma.PlaylistInclude = { entries: false }
      if (request.query.entries) include.entries = { orderBy: { position: "asc" } }

      const playlist = await prisma.playlist.findUnique({
        where: { id: request.params.id },
        include,
      })

      if (!playlist) throw new NotFoundException("Playlist not found")
      if (request.session.user.isAdmin || playlist.authorId === request.session.user.id)
        visiblities.push("private")
      if (!visiblities.includes(playlist.visibility))
        throw new NotFoundException("Playlist not found")

      reply.send({ success: true, playlist: playlistMapper.one(playlist) })
    },
  )

  instance.put<{
    Params: GetPlaylistParamsDto
    Body: UpdatePlaylistDto
  }>(
    "/:id",
    {
      preHandler: [
        instance.validateParams(GetPlaylistParamsDto),
        instance.validateBody(UpdatePlaylistDto),
      ],
    },
    async (request, reply) => {
      const editedPlaylist = await prisma.playlist.update({
        data: {
          title: request.body.title,
          slug: request.body.title.toLowerCase().replace(/\s/g, "-"),
          description: request.body.description,
          authorId: request.session.user.id,
          visibility: request.body.visibility,
        },
        where: { id: request.params.id },
        include: { entries: { orderBy: { position: "asc" } } },
      })

      if (request.body.musics) {
        await prisma.playlistEntry.deleteMany({
          where: { musicId: { notIn: request.body.musics }, playlistId: request.params.id },
        })

        const acc = request.body.musics.reduce<{
          i: { id: number; position: number }[]
          u: { id: number; position: number }[]
        }>(
          (acc, current, index) => {
            if (editedPlaylist.entries.findIndex((entry) => entry.musicId === current) === -1) {
              acc.i.push({ id: current, position: index })
            } else {
              acc.u.push({ id: current, position: index })
            }
            return acc
          },
          { i: [], u: [] },
        )

        for (const { id, position } of acc.u) {
          await prisma.playlistEntry.update({
            where: { playlistId_musicId: { playlistId: request.params.id, musicId: id } },
            data: { position },
          })
        }

        await prisma.playlistEntry.createMany({
          data: acc.i.map((entry) => ({
            playlistId: request.params.id,
            musicId: entry.id,
            position: entry.position,
          })),
        })
      }

      reply.send({ success: true, playlist: playlistMapper.one(editedPlaylist) })
    },
  )

  instance.delete<{ Params: GetPlaylistParamsDto }>(
    "/:id",
    { preHandler: instance.validateParams(GetPlaylistParamsDto) },
    async (request, reply) => {
      try {
        const playlist = await prisma.playlist.findUnique({
          where: { id: +request.params.id },
        })

        if (!playlist) throw new NotFoundException("Playlist not found")

        if (!request.session.user.isAdmin && !(playlist.authorId === +request.session.user.id))
          throw new NotFoundException("Playlist not found")

        await prisma.playlist.delete({ where: { id: playlist.id } })

        reply.send({ success: true, playlist: playlistMapper.one(playlist) })
      } catch (err) {
        if (err instanceof PrismaClientKnownRequestError)
          if (err.code === "P2025") throw new NotFoundException("Playlist not found")

        throw err
      }
    },
  )

  instance.get<{
    Reply: PlaylistEntriesResponse
    Params: GetPlaylistParamsDto
    Querystring: Prisma.PlaylistEntryInclude
  }>("/:id/entries", async (request, reply) => {
    const playlist = await prisma.playlist.findUnique({ where: { id: +request.params.id } })

    if (!playlist) throw new NotFoundException("Playlist not found")

    const entries: PrismaEntry[] = await prisma.playlistEntry.findMany({
      where: { playlistId: playlist.id },
      orderBy: { position: "asc" },
      include: { music: true },
    })

    return reply.send({ success: true, entries: entryMapper.many(entries) })
  })

  instance.post<{ Params: AddMusicToPlaylistDto }>(
    "/:id/musics/:musicId",
    { preHandler: instance.validateParams(AddMusicToPlaylistDto) },
    async (request, reply) => {
      const [music, playlist, lastEntry] = await Promise.all([
        prisma.music.findUnique({ where: { id: +request.params.musicId } }),
        prisma.playlist.findUnique({ where: { id: +request.params.id } }),
        prisma.playlistEntry.findFirst({
          where: { playlistId: +request.params.id },
          orderBy: { position: "desc" },
        }),
      ])

      if (!music) throw new NotFoundException("Music not found")
      if (!playlist) throw new NotFoundException("Playlist not found")

      if (!(playlist.authorId === request.session.user.id) && !request.session.user.isAdmin)
        throw new NotFoundException("Playlist not found")

      const entry = await prisma.playlistEntry.create({
        data: {
          playlistId: playlist.id,
          musicId: music.id,
          position: lastEntry ? lastEntry.position + 1 : 0,
        },
      })

      reply.send({ success: true, entry: entryMapper.one(entry) })
    },
  )

  instance.delete(
    "/:id/musics/:musicId",
    { preHandler: instance.validateParams(AddMusicToPlaylistDto) },
    async (request, reply) => {
      const [music, playlist] = await Promise.all([
        prisma.music.findUnique({ where: { id: +request.params.musicId } }),
        prisma.playlist.findUnique({ where: { id: +request.params.id } }),
      ])

      if (!music) throw new NotFoundException("Music not found")
      if (!playlist) throw new NotFoundException("Playlist not found - 01")
      if (!(playlist.authorId === request.session.user.id) && !request.session.user.isAdmin)
        throw new NotFoundException("Playlist not found - 02")

      await prisma.playlistEntry.delete({
        where: { playlistId_musicId: { playlistId: playlist.id, musicId: music.id } },
      })

      reply.status(202).send({ success: true })
    },
  )

  instance.get<{ Querystring: SearchMusicQuery }>(
    "/search/:query",
    { preHandler: instance.validateQuery(SearchMusicQuery) },
    async (request, reply) => {
      const playlists = await prisma.playlist.findMany({
        where: {
          OR: [{ title: { contains: request.query.q } }, { slug: { contains: request.query.q } }],
        },
      })

      reply.send({ success: true, playlists: playlistMapper.many(playlists) })
    },
  )
}
