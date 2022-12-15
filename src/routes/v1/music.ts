import fs from "node:fs"
import { FastifyInstance } from "fastify"

import prisma from "utils/prisma"
import isLogin from "middlewares/isLogin"
import InternalServerException from "exceptions/http/InternalServerException"
import NotFoundException from "exceptions/http/NotFoundException"
import { dlAudio } from "services/ytconverter"

export default function musicRoutes(instance: FastifyInstance, options: any, done: Function) {
  instance.get<{ Params: { id: string } }>("/music/:id", async (request, reply) => {
    instance.addHook("onRequest", isLogin)

    const music = await prisma.music.findUnique({ where: { id: +request.params.id } })

    if (!music) throw new NotFoundException("Music not found")

    const buffer = await dlAudio(music.youtubeId).then((res) => res.arrayBuffer())
    if (!buffer) throw new InternalServerException("Something went wrong")

    const stream = fs.createReadStream(Buffer.from(buffer))
    reply.send(stream)
  })

  done()
}
