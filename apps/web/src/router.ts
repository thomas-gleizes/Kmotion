import { lazy, ReactRouter, RootRoute, Route } from "@tanstack/react-router"

import Root from "./pages/Root"
import AppRoot from "./pages/app/Root"
import AuthRoot from "./pages/auth/Root"
import AdminRoot from "./pages/admin/Root"
import OtherRoot from "./pages/others/Root"
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

// Admin => /admin/*
const adminRootRoute = new Route({
  path: "admin",
  getParentRoute: () => rootRoute,
  component: AdminRoot,
})

const adminRoutes = [
  new Route({
    path: "/",
    component: lazy(() => import("./pages/admin/Home")),
    getParentRoute: () => adminRootRoute,
  }),
  new Route({
    path: "/users",
    component: lazy(() => import("./pages/admin/Users")),
    getParentRoute: () => adminRootRoute,
  }),
  new Route({
    path: "/musics",
    component: lazy(() => import("./pages/admin/Musics")),
    getParentRoute: () => adminRootRoute,
  }),
]

// Others => /out/*
const otherRootRoute = new Route({
  path: "out",
  component: OtherRoot,
  getParentRoute: () => rootRoute,
})

const otherRoutes = [
  new Route({
    path: "test/$token",
    component: lazy(() => import("./pages/others/Music")),
    getParentRoute: () => otherRootRoute,
  }),
  new Route({
    path: "*",
    component: NotFound,
    getParentRoute: () => otherRootRoute,
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
  adminRootRoute.addChildren(adminRoutes),
  otherRootRoute.addChildren(otherRoutes),
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
