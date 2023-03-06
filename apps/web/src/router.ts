import { lazy, ReactRouter, RootRoute, Route } from "@tanstack/react-router"

import Root from "./pages/Root"
import NotFound from "./pages/NotFound"

const rootRoute = new RootRoute({
  component: Root,
})

const indexRoute = new Route({
  path: "/",
  component: lazy(() => import("./pages/Home")),
  getParentRoute: () => rootRoute,
})

const authRootRoute = new Route({
  path: "auth",
  getParentRoute: () => rootRoute,
})

const authRoutes = [
  new Route({
    path: "login",
    component: lazy(() => import("./pages/auth/Login")),
    getParentRoute: () => authRootRoute,
  }),
  new Route({
    path: "register",
    component: lazy(() => import("./pages/auth/Register")),
    getParentRoute: () => authRootRoute,
  }),
]

const appRootRoute = new Route({
  path: "app",
  getParentRoute: () => rootRoute,
  component: lazy(() => import("./pages/app/Root")),
})

const appRoutes = [
  new Route({
    path: "playlists",
    component: lazy(() => import("./pages/app/Playlist")),
    getParentRoute: () => appRootRoute,
  }),
]

const notFoundRoute = new Route({
  path: "*",
  component: NotFound,
  getParentRoute: () => rootRoute,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  appRootRoute.addChildren(appRoutes),
  authRootRoute.addChildren(authRoutes),
  notFoundRoute,
])

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