import React from "react"
import { Outlet, SyncRouteComponent } from "@tanstack/react-router"

import ContextsProvider from "../contexts"
import MobileLayout from "../components/layouts/MobileLayout"
import DesktopLayout from "../components/layouts/DesktopLayout"
import { useLayoutContext } from "../contexts/layout"

const Root: SyncRouteComponent = () => {
  return (
    <ContextsProvider>
      <Layout />
    </ContextsProvider>
  )
}

const Layout = () => {
  const context = useLayoutContext()

  if (context.mobile.value)
    return (
      <MobileLayout>
        <Outlet />
      </MobileLayout>
    )

  return (
    <DesktopLayout>
      <Outlet />
    </DesktopLayout>
  )
}

export default Root
