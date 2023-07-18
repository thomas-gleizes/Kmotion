import { FastifyInstance } from "fastify"

import authRoutes from "./auth"
import userRoutes from "./user"
import musicRoutes from "./music"
import playlistRoutes from "./playlist"
import extensionRoutes from "./extension"
import logger from "../../plugins/logger"
import { validateBody, validateParams, validateQuery } from "../../decorators/validations"
import exceptionHandler from "../../plugins/exceptionHandler"

export default async function v1(instance: FastifyInstance) {
  instance
    .addHook("onRequest", logger)
    .decorate("validateBody", validateBody)
    .decorate("validateParams", validateParams)
    .decorate("validateQuery", validateQuery)

  instance
    .register(authRoutes, { prefix: "/auth" })
    .register(userRoutes, { prefix: "/users" })
    .register(playlistRoutes, { prefix: "/playlists" })
    .register(musicRoutes, { prefix: "/musics" })
    .register(extensionRoutes, { prefix: "/extension" })

  instance.setErrorHandler(exceptionHandler)
}
