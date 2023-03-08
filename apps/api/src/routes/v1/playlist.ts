import { FastifyInstance } from "fastify"
import { Prisma, Visibility } from "@prisma/client"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

import {
  AddMusicToPlaylistDto,
  CreatePlaylistDto,
  GetPlaylistParamsDto,
  QueryGetPlaylist,
  SearchParamsDto,
}from "@kmotion/validations"
im;port { entryMapper, playlistMapper } from "@kmotion/mappers"
im;port prisma from "../../services/prisma"
im;port isLogin from "../../middlewares/isLogin"
import NotFoundException from "../../exceptions/http/NotFoundException";
import { PrismaEntry } from "@kmotion/types";

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
          visibility: request.body.visibility
        },
      })

      reply.status(201).send({ success: true, playlist: playlistMapper.one(playlist) });
    }
  )

  instance.get<{ Querystring: QueryGetPlaylist }>("/", async (request, reply) => {
    const include = { entries: false };
    if (request.query.entries) include.entries = true;

    const playlists = await prisma.playlist.findMany({
      where: { authorId: request.session.user.id },
      include
    });

    reply.send({ success: true, playlists: playlistMapper.many(playlists) });
  });

  instance.get<{ Params: GetPlaylistParamsDto; Querystring: QueryGetPlaylist }>(
    "/:id",
    { preHandler: instance.validateParams(GetPlaylistParamsDto) },
    async (request, reply) => {
      const visiblities: Visibility[] = ["public"];

      const include = { entries: false };
      if (request.query.entries) include.entries = true;

      const playlist = await prisma.playlist.findUnique({
        where: { id: request.params.id },
        include
      });

      if (!playlist) throw new NotFoundException("Playlist not found");
      if (request.session.user.isAdmin || playlist.authorId === request.session.user.id)
        visiblities.push("private");
      if (!visiblities.includes(playlist.visibility))
        throw new NotFoundException("Playlist not found")

      reply.send({ success: true, playlist: playlistMapper.one(playlist) });
    }
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

        reply.send({ success: true, playlist: playlistMapper.one(playlist) });
      } catch (err) {
        if (err instanceof PrismaClientKnownRequestError)
          if (err.code === "P2025") throw new NotFoundException("Playlist not found");

        throw err;
      }
    }
  )

  instance.get<{ Params: GetPlaylistParamsDto; Querystring: Prisma.PlaylistEntryInclude }>(
    "/:id/entries",
    async (request, reply) => {
      const playlist = await prisma.playlist.findUnique({ where: { id: +request.params.id } });

      if (!playlist) throw new NotFoundException("Playlist not found");

      const entries: PrismaEntry[] = await prisma.playlistEntry.findMany({
        where: { playlistId: playlist.id },
        orderBy: { position: "asc" },
        include: request.query
      });

      return reply.send({ success: true, entries: entryMapper.many(entries) });
    }
  );

  instance.post<{ Params: AddMusicToPlaylistDto }>(
    "/:id/musics/:musicId",
    { preHandler: instance.validateParams(AddMusicToPlaylistDto) },
    async (request, reply) => {
      const [music, playlist] = await Promise.all([
        prisma.music.findUnique({ where: { id: +request.params.musicId } }),
        prisma.playlist.findUnique({ where: { id: +request.params.id } }),
      ])

      if (!music) throw new NotFoundException("Music not found")
      if (!playlist) throw new NotFoundException("Playlist not found")

      if (!(playlist.authorId === request.session.user.id) && !request.session.user.isAdmin)
        throw new NotFoundException("Playlist not found")

      const entry = await prisma.playlistEntry.create({
        data: {
          playlistId: playlist.id,
          musicId: music.id,
          position: 0,
        },
      })

      reply.send({ success: true, entry: entryMapper.one(entry) });
    }
  )

  instance.get<{ Params: SearchParamsDto }>(
    "/search/:query",
    { preHandler: instance.validateParams(SearchParamsDto) },
    async (request, reply) => {
      const playlists = await prisma.playlist.findMany({
        where: {
          OR: [
            { title: { contains: request.params.query } },
            { slug: { contains: request.params.query } },
          ],
        },
      })

      reply.send({ success: true, playlists: playlistMapper.many(playlists) });
    }
  )
}
