import { FastifyInstance } from "fastify"

import authRoutes from "routes/v1/auth"
import userRoutes from "routes/v1/user"
import musicRoutes from "routes/v1/music"
import playlistRoutes from "routes/v1/playlist"

export default function v1(instance: FastifyInstance, opts: any, done: Function) {
  instance.register(authRoutes, { prefix: "/auth" })
  instance.register(userRoutes, { prefix: "/users" })
  instance.register(playlistRoutes, { prefix: "/playlists" })
  instance.register(musicRoutes, { prefix: "/musics" })

  done()
}
