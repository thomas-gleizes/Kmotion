import React from "react"
import { Outlet, SyncRouteComponent } from "@tanstack/react-router"

import ContextsProvider from "../contexts"

const Root: SyncRouteComponent = () => {
  return (
    <ContextsProvider>
      <Outlet />
    </ContextsProvider>
  )
}

export default Root
