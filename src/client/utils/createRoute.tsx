import React from "react"
import { LoaderFunction, redirect, RouteObject, useLoaderData } from "react-router-dom"

import { Page } from "types"

const ConnectProps: React.FC<{ Page: React.FC }> = ({ Page }) => {
  const props = useLoaderData()

  // @ts-ignore
  return <Page {...props} />
}

function truncatePath(url: string, path: string) {
  let truncatedUrl = url
  const pathIndex = url.indexOf(path)
  if (pathIndex !== -1) {
    truncatedUrl = url.substring(0, pathIndex + path.length)
  }
  return truncatedUrl
}

function createLoader(path: string): LoaderFunction {
  return async ({ request }) => {
    const requestPath = "/props" + new URL(request.url).pathname
    const response = await fetch(truncatePath(requestPath, path))

    if (response.redirected) return redirect(response.url)

    return response.json()
  }
}

export default function createRoute(
  path: string,
  Page: Page,
  rest: Omit<Omit<Omit<RouteObject, "path">, "element">, "loader"> = {}
): RouteObject {
  // @ts-ignore
  return {
    path,
    element: <ConnectProps Page={Page} />,
    loader: typeof Page.serverSideProps === "function" ? createLoader(path) : undefined,
    ...rest
  }
}
