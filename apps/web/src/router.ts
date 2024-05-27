import { createRootRouteWithContext, createRoute, createRouter } from "@tanstack/react-router"
import { QueryClient } from "@tanstack/react-query"

import { queryClient } from "./queryClient"
import Root from "./pages/Root"
import AppRoot from "./pages/app/Root"
import AuthRoot from "./pages/auth/Root"
import AdminRoot from "./pages/admin/Root"
import OtherRoot from "./pages/others/Root"
import NotFound from "./pages/NotFound"
import MusicsPage, { musicsQueryOptions } from "./pages/app/Musics"
import PlaylistPage, { entriesQueryOptions, playlistQueryOptions } from "./pages/app/Playlist"
import PlaylistsPage, { playlistsQueryOptions } from "./pages/app/Playlists"
import SettingsPage from "./pages/app/Settings"
import AdminHomePage from "./pages/admin/Home"
import AdminUsersPage from "./pages/admin/Users"
import AdminMusicsPage from "./pages/admin/Musics"
import OthersMusicPage from "./pages/others/Music"
import RegisterPage from "./pages/auth/Register"
import LoginPage from "./pages/auth/Login"
import HomePage from "./pages/Home"

type RootContext = {
  queryClient: QueryClient
}

const rootRoute = createRootRouteWithContext<RootContext>()({
  component: Root,
})

const indexRoute = createRoute({
  path: "/",
  component: HomePage,
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
    component: LoginPage,
    getParentRoute: () => authRootRoute,
  }),
  createRoute({
    path: "register",
    component: RegisterPage,
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
    component: PlaylistsPage,
    getParentRoute: () => appRootRoute,
    loader: ({ context }) => context.queryClient.prefetchQuery(playlistsQueryOptions),
  }),
  createRoute({
    path: "playlist/$id",
    component: PlaylistPage,
    getParentRoute: () => appRootRoute,
    loader: ({ context, params }) =>
      Promise.all([
        context.queryClient.prefetchQuery(entriesQueryOptions(+params.id)),
        context.queryClient.prefetchQuery(playlistQueryOptions(+params.id)),
      ]),
  }),
  createRoute({
    path: "musics",
    component: MusicsPage,
    getParentRoute: () => appRootRoute,
    loader: ({ context }) => context.queryClient.prefetchInfiniteQuery(musicsQueryOptions),
  }),
  createRoute({
    path: "settings",
    component: SettingsPage,
    getParentRoute: () => appRootRoute,
  }),
  createRoute({
    path: "/*",
    component: NotFound,
    getParentRoute: () => appRootRoute,
  }),
  createRoute({
    path: "/",
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
    component: AdminHomePage,
    getParentRoute: () => adminRootRoute,
  }),
  createRoute({
    path: "/users",
    component: AdminUsersPage,
    getParentRoute: () => adminRootRoute,
  }),
  createRoute({
    path: "/musics",
    component: AdminMusicsPage,
    getParentRoute: () => adminRootRoute,
    validateSearch: (
      search: Record<string, unknown>,
    ): { page: number; row: number; order: "asc" | "desc" } => ({
      page: search.page ? +search.page : 0,
      row: search.row ? +search.row : 10,
      order: search.order === "asc" ? "asc" : "desc",
    }),
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
    component: OthersMusicPage,
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
  context: { queryClient },
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
