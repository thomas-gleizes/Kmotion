import React from "react"
import { Navigate, Outlet } from "@tanstack/react-router"

import DynamicPlayer from "../../components/DynamicPlayer"
import NavBar from "../../components/NavBar"
import PlayerProvider from "../../contexts/player"
import { useAuthContext } from "../../contexts/auth"

const AppRoot: Component = () => {
  const authContext = useAuthContext("dont_know")

  if (!authContext.authenticated) return <Navigate to="/" />

  return (
    <PlayerProvider>
      <Outlet />
      <div className="absolute w-full bottom-0">
        <DynamicPlayer />
        <NavBar />
      </div>
      <div id="portal" />
    </PlayerProvider>
  )
}

export default AppRoot
