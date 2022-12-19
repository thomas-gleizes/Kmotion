import fs from "node:fs/promises"
import { FastifyReply, FastifyRequest } from "fastify"
import ReactDom from "react-dom/server"
import { StaticRouter } from "react-router-dom/server.js"

import App from "./App"

export default async function renderApp(route: any, request: FastifyRequest, reply: FastifyReply) {
  const props = {}

  return fs
    .readFile("src/client/base.html")
    .then((buffer) => buffer.toString("utf-8"))
    .then((html) =>
      html.replace(
        "<!-- APP -->",
        ReactDom.renderToString(
          <StaticRouter location={route.path}>
            <App />
          </StaticRouter>
        )
      )
    )
    .then((html) => html.replace("<!-- PROPS -->", JSON.stringify(props)))
}
