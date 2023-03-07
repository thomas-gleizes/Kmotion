import React from "react"
import { Navigate, Outlet, SyncRouteComponent } from "@tanstack/react-router"

import { useAuthContext } from "../../contexts/auth"

const AuthRoot: SyncRouteComponent = () => {
  const authContext = useAuthContext("dont_know")

  if (authContext.authenticated) return <Navigate to="/" />

  return (
    <section className="h-full h-full flex flex-col items-center justify-center">
      <div>
        <Outlet />
      </div>
    </section>
  )
}

export default AuthRoot
