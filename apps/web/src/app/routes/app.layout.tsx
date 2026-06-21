import { createRoute, redirect } from "@tanstack/react-router"
import { rootRoute } from "@/app/router"
import { isAuthenticated } from "@/features/auth/auth"
import { AppShell } from "@/shared/ui/layout/AppShell"

export const appLayoutRoute = createRoute({
  id: "app",
  getParentRoute: () => rootRoute,
  component: AppShell,
  beforeLoad: () => {
    if (!isAuthenticated()) throw redirect({ to: "/welcome" })
  },
})
