import React from "react"
import { Outlet, SyncRouteComponent } from "@tanstack/react-router"

const AuthRoot: SyncRouteComponent = () => {
  return (
    <div className="flex justify-center items-center h-[80vh] bg-gray-50 mx-2">
      <div>Auth</div>
      <Outlet />
    </div>
  )
}

export default AuthRoot
