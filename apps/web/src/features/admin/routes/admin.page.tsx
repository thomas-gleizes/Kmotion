import { createRoute, Outlet, redirect } from "@tanstack/react-router"
import { appLayoutRoute } from "@/app/routes/app.layout"
import { isAuthenticated, getCurrentUser } from "@/features/auth/auth"
import { pageHeading } from "@/shared/lib/styles"
import { ConversionsSection } from "@/features/admin/components/ConversionsSection"
import { MusicsSection } from "@/features/admin/components/MusicsSection"
import { UsersSection } from "@/features/admin/components/UsersSection"

// Chaque ancien onglet de l'admin est une route à part, accessible depuis la
// section « Administration » du menu.
export const adminRoute = createRoute({
  path: "/admin",
  component: Outlet,
  getParentRoute: () => appLayoutRoute,
  beforeLoad: () => {
    if (!isAuthenticated() || !getCurrentUser()?.isAdmin) {
      throw redirect({ to: "/" })
    }
  },
})

const adminIndexRoute = createRoute({
  path: "/",
  getParentRoute: () => adminRoute,
  beforeLoad: () => {
    throw redirect({ to: "/admin/library" })
  },
})

const adminLibraryRoute = createRoute({
  path: "library",
  getParentRoute: () => adminRoute,
  component: () => (
    <div>
      <h1 className={pageHeading}>Bibliothèque</h1>
      <MusicsSection />
    </div>
  ),
})

const adminConversionsRoute = createRoute({
  path: "conversions",
  getParentRoute: () => adminRoute,
  component: () => (
    <div>
      <h1 className={pageHeading}>Conversions</h1>
      <ConversionsSection />
    </div>
  ),
})

const adminUsersRoute = createRoute({
  path: "users",
  getParentRoute: () => adminRoute,
  component: () => (
    <div>
      <h1 className={pageHeading}>Utilisateurs</h1>
      <UsersSection />
    </div>
  ),
})

export const adminRouteTree = adminRoute.addChildren([
  adminIndexRoute,
  adminLibraryRoute,
  adminConversionsRoute,
  adminUsersRoute,
])
