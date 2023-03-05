import React from "react"
import { Outlet, SyncRouteComponent } from "@tanstack/react-router"

const AuthRoot: SyncRouteComponent = () => {
  return (
    <div className="">
      <Outlet />
    </div>
  )
}

export default AuthRoot
