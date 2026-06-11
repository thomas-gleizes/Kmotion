import { QueryClient } from "@tanstack/react-query"
import { createRootRouteWithContext, createRouter } from "@tanstack/react-router"
import { queryClient } from "./queryClient.ts"
import { Root } from "./routes/root.tsx"
import { landingRoute } from "./routes/landing.page.tsx"
import { loginRoute } from "./routes/login.page.tsx"
import { registerRoute } from "./routes/register.page.tsx"
import { appLayoutRoute } from "./routes/app.layout.tsx"
import { homeRoute } from "./routes/home.page.tsx"
import { searchRoute } from "./routes/search.page.tsx"
import { playlistsRoute } from "./routes/playlists.page.tsx"
import { playlistDetailRoute } from "./routes/playlist-detail.page.tsx"
import { addMusicRoute } from "./routes/add-music.page.tsx"
import { profileRoute } from "./routes/profile.page.tsx"
import { adminRoute } from "./routes/admin.page.tsx"

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
