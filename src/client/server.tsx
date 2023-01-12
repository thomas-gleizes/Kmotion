import fs from "node:fs/promises"
import { FastifyReply, FastifyRequest } from "fastify"
import ReactDom from "react-dom/server"
import { StaticRouter } from "react-router-dom/server.js"

import { Route } from "types"
export default async function renderApp(
  route: Route,
  request: FastifyRequest<any>,
  reply: FastifyReply
) {
  const Page = route.page.props.Page

  let props = {}

  if (Page.serverSideProps) {
    props = await Page.serverSideProps(request, reply)
  }

  return fs
    .readFile("src/client/base.html")
    .then((buffer) => buffer.toString("utf-8"))
    .then((html) => html.replaceAll("%URL%", "http://localhost:8000"))
    .then((html) =>
      html.replace(
        "<!-- APP -->",
        ReactDom.renderToString(
          <StaticRouter location={route.path}>
            <Page {...props} />
          </StaticRouter>
        )
      )
    )
    .then((html) =>
      html.replace("<!-- PROPS -->", JSON.stringify({ pageProps: props, appProps: {} }))
    )
}
