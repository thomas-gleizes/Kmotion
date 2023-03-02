import React from "react"
import { Outlet, SyncRouteComponent } from "@tanstack/react-router"

const Root: SyncRouteComponent = () => {
  return (
    <div>
      <Outlet />
    </div>
  )
}

export default Root
