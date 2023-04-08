import React from "react"
import { Outlet } from "@tanstack/react-router"

import AuthProvider, { useAuthContext } from "../contexts/auth"

const AppRoot: React.FC = () => {
  const ctx = useAuthContext()

  return <main>{!ctx.isReady ? <div>Loading...</div> : <Outlet />}</main>
}

export default AppRoot
