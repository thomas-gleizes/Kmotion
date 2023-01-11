import { generatePath, RouteObject } from "react-router-dom"
import { Page } from "types"

type Route = {
  path: string
  page: any,

}

export default function generateRouter(routes: RouteObject[], basePath: string = ""): Route[] {
  const result: Route[] = []

  for (const route of routes) {
    if (typeof route.children !== "undefined") {
      result.push(...generateRouter(route.children, route.path))
    } else {
      result.push({
        path: `${basePath}/${route.path}`,
        page: route.element
      })
    }
  }

  return result
}