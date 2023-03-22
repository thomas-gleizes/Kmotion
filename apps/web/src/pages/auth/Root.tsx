import React from "react"
import { Navigate, Outlet, SyncRouteComponent } from "@tanstack/react-router"

import { useAuthContext } from "../../contexts/auth"

const AuthRoot: SyncRouteComponent = () => {
  const authContext = useAuthContext()

  if (authContext.authenticated) return <Navigate to="/" />

  return (
    <section className="h-full h-full flex flex-col items-center justify-center">
      <Outlet />
    </section>
  )
}

export default AuthRoot
