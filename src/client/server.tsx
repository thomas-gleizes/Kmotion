import fs from "node:fs/promises"
import { FastifyReply, FastifyRequest } from "fastify"
import ReactDom from "react-dom/server"
import { StaticRouter } from "react-router-dom/server.js"

import { Route } from "types"
import App from "./App"

export default async function renderApp(
  route: Route,
  request: FastifyRequest<any>,
  reply: FastifyReply
) {
  let props: any = {}

  if (route.serverSideProps) {
    props = await route.serverSideProps(request, reply)
  }

  return fs
    .readFile("src/client/base.html")
    .then((buffer) => buffer.toString("utf-8"))
    .then((html) =>
      html.replace(
        "<!-- APP -->",
        ReactDom.renderToString(
          <StaticRouter location={route.path}>
            <App pageProps={props} />
          </StaticRouter>
        )
      )
    )
    .then((html) => html.replace("<!-- PROPS -->", JSON.stringify(props)))
}
