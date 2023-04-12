import React from "react"
import { Outlet } from "@tanstack/react-router"

import AuthProvider, { useAuthContext } from "../contexts/auth"

const AppRoot: React.FC = () => {
  const ctx = useAuthContext()

  return (
    <div className="border-2 border-neutral-900">
      {!ctx.isReady ? <div>Loading...</div> : <Outlet />}
    </div>
  )
}

export default AppRoot
