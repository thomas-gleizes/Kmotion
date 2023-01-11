import React from "react"
import { RouteObject, useLoaderData } from "react-router-dom"

const ConnectProps: React.FC<{ Page: React.FC }> = ({ Page }) => {
  const props = useLoaderData()

  // @ts-ignore
  return <Page {...props} />
}

export default function createRoute(path: string, Page: React.FC<any>): RouteObject {
  return {
    path,
    element: <ConnectProps Page={Page} />
  }
}
