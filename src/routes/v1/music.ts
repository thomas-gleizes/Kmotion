import { FastifyInstance } from "fastify"
import isLogin from "middlewares/isLogin"
import prisma from "utils/prisma"
import BadRequestException from "exceptions/http/BadRequestException"
import isAdmin from "middlewares/isAdmin"
import YtConverter from "services/ytconverter"

export default function musicRoutes(instance: FastifyInstance, options: any, done: Function) {
  instance.addHook("onRequest", isLogin)

  const ytConverter = YtConverter.getInstance()

  instance.get("/sync", { onRequest: [isAdmin] }, async (request, reply) => {
    const musics = await ytConverter.musics()

    for (const music of musics) {
      const find = await prisma.music.findUnique({ where: { youtubeId: music.id } })
    }

    return { success: true, meta: { new: 5 } }
  })

  instance.post<{ Params: { id: string } }>("/:id/add", async (request, reply) => {
    const music = await prisma.music.findUnique({ where: { id: +request.params.id } })

    if (music) throw new BadRequestException("Music already exists")

    reply.send({ success: "true" })
  })

  done()
}
