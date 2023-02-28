import { FastifyInstance } from "fastify";
import { Visibility } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import prisma from "../../services/prisma";
import isLogin from "../../middlewares/isLogin";
import isAdmin from "../../middlewares/isAdmin";
import NotFoundException from "../../exceptions/http/NotFoundException";
import { SearchParamsSchema } from "../../schemas/generic";
import {
  AddMusicToPlaylistSchema,
  CreatePlaylistSchema,
  GetPlaylistSchema,
} from "../../schemas/playlist";

export default async function playlistRoutes(instance: FastifyInstance) {
  instance.addHook("onRequest", isLogin);

  instance.post<{ Body: CreatePlaylistSchema }>(
    "/",
    { preHandler: instance.validateBody(CreatePlaylistSchema) },
    async (request, reply) => {
      const playlist = await prisma.playlist.create({
        data: {
          title: request.body.title,
          slug: request.body.title.toLowerCase().replace(/\s/g, "-"),
          description: request.body.description,
          authorId: request.session.user.id,
          visibility: request.body.visibility,
        },
      });

      reply.status(201).send({ success: true, playlist });
    }
  );

  instance.get("/", { onRequest: [isAdmin] }, async (request, reply) => {
    const playlists = await prisma.playlist.findMany();

    reply.send({ success: true, playlists });
  });

  instance.get<{ Params: GetPlaylistSchema }>(
    "/:id",
    { preHandler: instance.validateParams(GetPlaylistSchema) },
    async (request, reply) => {
      const visiblities: Visibility[] = ["public"];

      const playlist = await prisma.playlist.findUnique({
        where: { id: request.params.id },
      });

      if (!playlist) throw new NotFoundException("Playlist not found");
      if (
        request.session.user.isAdmin ||
        playlist.authorId === request.session.user.id
      )
        visiblities.push("private");
      if (!visiblities.includes(playlist.visibility))
        throw new NotFoundException("Playlist not found");

      reply.send({ success: true, playlist });
    }
  );

  instance.delete<{ Params: GetPlaylistSchema }>(
    "/:id",
    { preHandler: instance.validateParams(GetPlaylistSchema) },
    async (request, reply) => {
      try {
        const playlist = await prisma.playlist.findUnique({
          where: { id: +request.params.id },
        });

        if (!playlist) throw new NotFoundException("Playlist not found");

        if (
          !request.session.user.isAdmin &&
          !(playlist.authorId === +request.session.user.id)
        )
          throw new NotFoundException("Playlist not found");

        await prisma.playlist.delete({ where: { id: playlist.id } });

        reply.send({ success: true, playlist });
      } catch (err) {
        if (err instanceof PrismaClientKnownRequestError)
          if (err.code === "P2025")
            throw new NotFoundException("Playlist not found");

        throw err;
      }
    }
  );

  instance.post<{ Params: AddMusicToPlaylistSchema }>(
    "/:id/music/:musicId",
    { preHandler: instance.validateParams(AddMusicToPlaylistSchema) },
    async (request, reply) => {
      const [music, playlist] = await Promise.all([
        prisma.music.findUnique({ where: { id: +request.params.musicId } }),
        prisma.playlist.findUnique({ where: { id: +request.params.id } }),
      ]);

      if (!music) throw new NotFoundException("Music not found");
      if (!playlist) throw new NotFoundException("Playlist not found");

      if (
        !(playlist.authorId === request.session.user.id) &&
        !request.session.user.isAdmin
      )
        throw new NotFoundException("Playlist not found");

      const entry = await prisma.playlistEntry.create({
        data: {
          playlistId: playlist.id,
          musicId: music.id,
          position: 0,
        },
      });

      reply.send({ success: true, entry });
    }
  );

  instance.get<{ Params: SearchParamsSchema }>(
    "/search/:query",
    { preHandler: instance.validateParams(SearchParamsSchema) },
    async (request, reply) => {
      const playlists = await prisma.playlist.findMany({
        where: {
          OR: [
            { title: { contains: request.params.query } },
            { slug: { contains: request.params.query } },
          ],
        },
      });

      reply.send({ success: true, playlists });
    }
  );
}
