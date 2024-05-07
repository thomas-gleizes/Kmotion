import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router"

import Root from "./pages/Root"
import AppRoot from "./pages/app/Root"
import AuthRoot from "./pages/auth/Root"
import AdminRoot from "./pages/admin/Root"
import OtherRoot from "./pages/others/Root"
import NotFound from "./pages/NotFound"
import { lazy } from "react"

const rootRoute = createRootRoute({
  component: Root,
})

const indexRoute = createRoute({
  path: "/",
  component: lazy(() => import("./pages/Home")),
  getParentRoute: () => rootRoute,
})

// Auth => /auth/*
const authRootRoute = createRoute({
  path: "auth",
  getParentRoute: () => rootRoute,
  component: AuthRoot,
})

const authRoutes = [
  createRoute({
    path: "login",
    component: lazy(() => import("./pages/auth/Login")),
    getParentRoute: () => authRootRoute,
  }),
  createRoute({
    path: "register",
    component: lazy(() => import("./pages/auth/Register")),
    getParentRoute: () => authRootRoute,
  }),
  createRoute({
    path: "*",
    component: NotFound,
    getParentRoute: () => authRootRoute,
  }),
]

// App => /app/*
const appRootRoute = createRoute({
  path: "app",
  getParentRoute: () => rootRoute,
  component: AppRoot,
})

const appRoutes = [
  createRoute({
    path: "playlists",
    component: lazy(() => import("./pages/app/Playlists")),
    getParentRoute: () => appRootRoute,
  }),
  createRoute({
    path: "playlist/$id",
    component: lazy(() => import("./pages/app/Playlist")),
    getParentRoute: () => appRootRoute,
  }),
  createRoute({
    path: "musics",
    component: lazy(() => import("./pages/app/Musics")),
    getParentRoute: () => appRootRoute,
  }),
  createRoute({
    path: "settings",
    component: lazy(() => import("./pages/app/Settings")),
    getParentRoute: () => appRootRoute,
  }),
  createRoute({
    path: "*",
    component: NotFound,
    getParentRoute: () => appRootRoute,
  }),
]

// Admin => /admin/*
const adminRootRoute = createRoute({
  path: "admin",
  getParentRoute: () => rootRoute,
  component: AdminRoot,
})

const adminRoutes = [
  createRoute({
    path: "/",
    component: lazy(() => import("./pages/admin/Home")),
    getParentRoute: () => adminRootRoute,
  }),
  createRoute({
    path: "/users",
    component: lazy(() => import("./pages/admin/Users")),
    getParentRoute: () => adminRootRoute,
  }),
  createRoute({
    path: "/musics",
    component: lazy(() => import("./pages/admin/Musics")),
    getParentRoute: () => adminRootRoute,
  }),
]

// Others => /out/*
const otherRootRoute = createRoute({
  path: "out",
  component: OtherRoot,
  getParentRoute: () => rootRoute,
})

const otherRoutes = [
  createRoute({
    path: "bypass/$token",
    component: lazy(() => import("./pages/others/Music")),
    getParentRoute: () => otherRootRoute,
  }),
  createRoute({
    path: "*",
    component: NotFound,
    getParentRoute: () => otherRootRoute,
  }),
]

const notFoundRoute = createRoute({
  path: "*",
  component: NotFound,
  getParentRoute: () => rootRoute,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  appRootRoute.addChildren(appRoutes),
  authRootRoute.addChildren(authRoutes),
  adminRootRoute.addChildren(adminRoutes),
  otherRootRoute.addChildren(otherRoutes),
  notFoundRoute,
])

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPreloadDelay: 200,
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
