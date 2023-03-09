import { lazy, ReactRouter, RootRoute, Route } from "@tanstack/react-router"

import Root from "./pages/Root"
import AppRoot from "./pages/app/Root"
import AuthRoot from "./pages/auth/Root"
import NotFound from "./pages/NotFound"

const rootRoute = new RootRoute({
  component: Root,
})

const indexRoute = new Route({
  path: "/",
  component: lazy(() => import("./pages/Home")),
  getParentRoute: () => rootRoute,
})

// Auth => /auth/*
const authRootRoute = new Route({
  path: "auth",
  getParentRoute: () => rootRoute,
  component: AuthRoot,
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
  new Route({
    path: "*",
    component: NotFound,
    getParentRoute: () => authRootRoute,
  }),
]

// App => /app/*
const appRootRoute = new Route({
  path: "app",
  getParentRoute: () => rootRoute,
  component: AppRoot,
})

const appRoutes = [
  new Route({
    path: "playlists",
    component: lazy(() => import("./pages/app/Playlists")),
    getParentRoute: () => appRootRoute,
  }),
  new Route({
    path: "playlist/$id",
    component: lazy(() => import("./pages/app/Playlist")),
    getParentRoute: () => appRootRoute,
  }),
  new Route({
    path: "musics",
    component: lazy(() => import("./pages/app/Musics")),
    getParentRoute: () => appRootRoute,
  }),
  new Route({
    path: "settings",
    component: lazy(() => import("./pages/app/Settings")),
    getParentRoute: () => appRootRoute,
  }),
  new Route({
    path: "*",
    component: NotFound,
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
