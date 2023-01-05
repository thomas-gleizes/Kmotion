import { FastifyInstance } from "fastify"

import authRoutes from "routes/v1/auth"
import userRoutes from "routes/v1/user"
import musicRoutes from "routes/v1/music"
import playlistRoutes from "routes/v1/playlist"
import logger from "plugins/logger"
import { validateBody, validateParams, validateQuery } from "decorators/validations"
import exceptionHandler from "plugins/exceptionHandler"

export default function v1(instance: FastifyInstance, opts: any, done: Function) {
  instance.addHook("onRequest", logger)
  instance.decorate("validateBody", validateBody)
  instance.decorate("validateParams", validateParams)
  instance.decorate("validateQuery", validateQuery)

  instance.register(authRoutes, { prefix: "/auth" })
  instance.register(userRoutes, { prefix: "/users" })
  instance.register(playlistRoutes, { prefix: "/playlists" })
  instance.register(musicRoutes, { prefix: "/musics" })

  instance.setErrorHandler(exceptionHandler)

  done()
}
