import fs from "node:fs/promises"
import { FastifyReply, FastifyRequest } from "fastify"
import ReactDom from "react-dom/server"
import { StaticRouter } from "react-router-dom/server.js"

import { Route } from "types"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import routes from "client/routes"

export default async function renderApp(
  route: Route,
  request: FastifyRequest<any>,
  reply: FastifyReply
) {
  const router = createBrowserRouter(routes)

  return fs
    .readFile("src/client/base.html")
    .then((buffer) => buffer.toString("utf-8"))
    .then((html) =>
      html.replace(
        "<!-- APP -->",
        ReactDom.renderToString(
          <StaticRouter location={route.path}>
            <RouterProvider router={router} />
          </StaticRouter>
        )
      )
    )
    .then((html) => html.replace("<!-- PROPS -->", JSON.stringify({ pageProps, appProps })))
}
