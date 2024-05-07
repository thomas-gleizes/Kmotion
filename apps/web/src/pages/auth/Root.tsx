import React from "react"
import { Navigate, Outlet, RouteComponent } from "@tanstack/react-router"

import { useAuthContext } from "../../contexts/auth"

const AuthRoot: RouteComponent = () => {
  const authContext = useAuthContext()

  if (authContext.authenticated) return <Navigate to="/" />

  return (
    <section className="h-full flex flex-col items-center justify-center">
      <Outlet />
    </section>
  )
}

export default AuthRoot
