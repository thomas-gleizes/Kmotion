import React from "react"
import { Navigate, Outlet, SyncRouteComponent } from "@tanstack/react-router"

import { useAuthContext } from "../../contexts/auth"
import { css } from "../../../styled-system/css"

const AuthRoot: SyncRouteComponent = () => {
  const authContext = useAuthContext()

  if (authContext.authenticated) return <Navigate to="/" />

  return (
    <section
      className={css({
        h: "full",
        w: "full",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      })}
    >
      <div className={css({ maxW: "4000px" })}>
        <Outlet />
      </div>
    </section>
  )
}

export default AuthRoot
