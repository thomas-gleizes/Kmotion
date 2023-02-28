import { FastifyInstance } from "fastify";

import authRoutes from "../../routes/v1/auth";
import userRoutes from "../../routes/v1/user";
import musicRoutes from "../../routes/v1/music";
import playlistRoutes from "../../routes/v1/playlist";
import logger from "../../plugins/logger";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../decorators/validations";
import exceptionHandler from "../../plugins/exceptionHandler";

export default async function v1(instance: FastifyInstance) {
  instance
    .addHook("onRequest", logger)
    .decorate("validateBody", validateBody)
    .decorate("validateParams", validateParams)
    .decorate("validateQuery", validateQuery);

  instance
    .register(authRoutes, { prefix: "/auth" })
    .register(userRoutes, { prefix: "/users" })
    .register(playlistRoutes, { prefix: "/playlists" })
    .register(musicRoutes, { prefix: "/musics" });

  instance.setErrorHandler(exceptionHandler);
}
