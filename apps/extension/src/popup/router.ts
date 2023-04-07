import { ReactRouter, RootRoute } from "@tanstack/react-router"

import AppRoot from "./layouts/AppRoot"

const rootRoute = new RootRoute({
  component: AppRoot,
})

const routeTree = rootRoute

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
