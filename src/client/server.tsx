import fs from "node:fs/promises"
import { FastifyReply, FastifyRequest } from "fastify"
import ReactDom from "react-dom/server"

import { Route } from "types"
import routes from "client/routes"

export default async function renderApp(
  route: Route,
  request: FastifyRequest<any>,
  reply: FastifyReply
) {
  console.log(route.path)
  return fs
    .readFile("src/client/base.html")
    .then((buffer) => buffer.toString("utf-8"))
    .then((html) => html.replace("<!-- APP -->", ReactDom.renderToString(<div></div>)))
    .then((html) => html.replace("<!-- PROPS -->", JSON.stringify({ pageProps: {}, appProps: {} })))
}
