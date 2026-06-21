import { useState } from "react"
import { createRoute, redirect } from "@tanstack/react-router"
import { cx } from "styled-system/css"
import { appLayoutRoute } from "@/app/routes/app.layout"
import { isAuthenticated, getCurrentUser } from "@/features/auth/auth"
import { pageHeading } from "@/shared/lib/styles"
import { tab, tabActive, tabs } from "@/features/admin/admin.styles"
import { MusicsSection } from "@/features/admin/components/MusicsSection"
import { UsersSection } from "@/features/admin/components/UsersSection"

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<"musics" | "users">("musics")

  return (
    <div>
      <h1 className={pageHeading}>Administration</h1>
      <div className={tabs}>
        <button
          type="button"
          className={cx(tab, activeTab === "musics" && tabActive)}
          onClick={() => setActiveTab("musics")}
        >
          Bibliothèque
        </button>
        <button
          type="button"
          className={cx(tab, activeTab === "users" && tabActive)}
          onClick={() => setActiveTab("users")}
        >
          Utilisateurs
        </button>
      </div>

      {activeTab === "musics" ? <MusicsSection /> : <UsersSection />}
    </div>
  )
}

export const adminRoute = createRoute({
  path: "/admin",
  component: AdminPage,
  getParentRoute: () => appLayoutRoute,
  beforeLoad: () => {
    if (!isAuthenticated() || !getCurrentUser()?.isAdmin) {
      throw redirect({ to: "/" })
    }
  },
})
