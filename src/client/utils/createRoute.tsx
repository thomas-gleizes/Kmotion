import React from "react"
import { LoaderFunction, RouteObject, useLoaderData } from "react-router-dom"
import { Page } from "types"

const ConnectProps: React.FC<{ Page: React.FC }> = ({ Page }) => {
  const props = useLoaderData()

  // @ts-ignore
  return <Page {...props} />
}

const loader: LoaderFunction = async ({ request }) => {
  console.log("loader", new URL(request.url).pathname)

  return fetch(`/props${new URL(request.url).pathname}`)
}

export default function createRoute(path: string, Page: Page): RouteObject {
  return {
    path,
    element: <ConnectProps Page={Page} />,
    loader: typeof Page.serverSideProps === "function" ? loader : undefined
  }
}
