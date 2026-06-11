import { createRoute, redirect } from "@tanstack/react-router"
import { rootRoute } from "../router"
import { isAuthenticated } from "../auth/auth"
import { AppShell } from "../components/AppShell"

export const appLayoutRoute = createRoute({
  id: "app",
  getParentRoute: () => rootRoute,
  component: AppShell,
  beforeLoad: () => {
    if (!isAuthenticated()) throw redirect({ to: "/welcome" })
  },
})
