import React from "react"
import { Navigate, Outlet } from "@tanstack/react-router"

import SmallPlayer from "../../components/common/Player/SmallPlayer"
import NavBar from "../../components/common/NavBar"
import PlayerProvider from "../../contexts/player"
import { useAuthContext } from "../../contexts/auth"

const AppRoot: Component = () => {
  const authContext = useAuthContext()

  if (!authContext.authenticated) return <Navigate to="/" />

  return (
    <PlayerProvider>
      <div id="portal" className="z-[100]" />
      <div className="absolute z-[50] w-full bottom-footer">
        <SmallPlayer />
      </div>
      <div className="absolute z-[1000] w-full bottom-0">
        <NavBar />
      </div>
      <Outlet />
    </PlayerProvider>
  )
}

export default AppRoot
