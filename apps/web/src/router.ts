import { ReactRouter, RootRoute, Route, lazy } from "@tanstack/react-router"

import Root from "./pages/Root"

const rootRoute = new RootRoute({ component: Root })

const indexRoute = new Route({
  path: "/",
  component: lazy(() => import("./pages/Home")),
  getParentRoute: () => rootRoute,
})

const authRootRoute = new RootRoute({
  component: lazy(() => import("./pages/auth/Root")),
})

const authRoutes = [
  new Route({
    path: "/auth/login",
    component: lazy(() => import("./pages/auth/Login")),
    getParentRoute: () => authRootRoute,
  }),
  new Route({
    path: "/auth/register",
    component: lazy(() => import("./pages/auth/Login")),
    getParentRoute: () => authRootRoute,
  }),
]

const routeTree = rootRoute.addChildren([indexRoute, ...authRoutes])

export const router = new ReactRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPreloadDelay: 200,
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
