import { QueryClient } from "@tanstack/react-query"
import { createRootRouteWithContext, createRouter } from "@tanstack/react-router"
import { queryClient } from "@/app/queryClient"
import { Root } from "@/app/routes/root"
import { landingRoute } from "@/features/auth/routes/landing.page"
import { loginRoute } from "@/features/auth/routes/login.page"
import { registerRoute } from "@/features/auth/routes/register.page"
import { appLayoutRoute } from "@/app/routes/app.layout"
import { homeRoute } from "@/features/music/routes/home.page"
import { likedRoute } from "@/features/music/routes/liked.page"
import { searchRoute } from "@/features/music/routes/search.page"
import { playlistsRoute } from "@/features/playlist/routes/playlists.page"
import { playlistDetailRoute } from "@/features/playlist/routes/playlist-detail.page"
import { addMusicRoute } from "@/features/music/routes/add-music.page"
import { profileRoute } from "@/features/profile/routes/profile.page"
import { adminRoute } from "@/features/admin/routes/admin.page"

type RootContext = {
  queryClient: QueryClient
}

export const rootRoute = createRootRouteWithContext<RootContext>()({
  component: Root,
})

const routeTree = rootRoute.addChildren([
  landingRoute,
  loginRoute,
  registerRoute,
  appLayoutRoute.addChildren([
    homeRoute,
    likedRoute,
    searchRoute,
    playlistsRoute,
    playlistDetailRoute,
    addMusicRoute,
    profileRoute,
    adminRoute,
  ]),
])

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
