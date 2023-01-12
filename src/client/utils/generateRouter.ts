import { RouteObject } from "react-router-dom"
import { Route } from "types"

export default function generateRouter(routes: RouteObject[], basePath: string = ""): Route[] {
  const result: Route[] = []

  for (const route of routes) {
    result.push({
      path: `${basePath}/${route.path}`.replace(/\/+/g, "/"),
      page: route.element
    })

    if (typeof route.children !== "undefined") {
      result.push(
        ...generateRouter(route.children, `${basePath}/${route.path}`.replace(/\/+/g, "/"))
      )
    }
  }

  return result
}
