import React from "react"
import { Outlet } from "@tanstack/react-router"
import DynamicPlayer from "../../components/DynamicPlayer"
import NavBar from "../../components/NavBar"

const AppRoot: Component = () => {
  return (
    <>
      <Outlet />
      <div className="absolute bottom-0 right-0 w-full">
        <DynamicPlayer />
        <NavBar />
      </div>
    </>
  )
}

export default AppRoot
