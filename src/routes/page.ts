import fs from "node:fs/promises"
import { FastifyInstance } from "fastify"

import logger from "plugins/logger"

export default function page(instance: FastifyInstance, opts: any, done: Function) {
  instance.addHook("onRequest", logger)

  instance.get("*", async (request, reply) => {
    const html = await fs
      .readFile("src/client/base.html")
      .then((buffer) => buffer.toString("utf-8"))
      .then((html) => html.replace("<!-- APP -->", ""))
      .then((html) =>
        html.replace("<!-- PROPS -->", JSON.stringify({ pageProps: {}, appProps: {} }))
      )

    reply.type("text/html").send(html)
  })

  done()
}
