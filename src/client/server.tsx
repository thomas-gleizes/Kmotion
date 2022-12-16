import fs from "node:fs/promises"
import ReactDom from "react-dom/server"

import App from "./App"
import { FastifyReply, FastifyRequest } from "fastify"

export default async function renderApp(route: any, request: FastifyRequest, reply: FastifyReply) {
  const baseHtml = await fs
    .readFile("src/client/base.html")
    .then((buffer) => buffer.toString("utf-8"))

  return baseHtml.replace("$ROOT$", ReactDom.renderToString(<App />))
}
