import React from "react"
import { Navigate, Outlet } from "@tanstack/react-router"
import DynamicPlayer from "../../components/DynamicPlayer"
import NavBar from "../../components/NavBar"
import { useAuthContext } from "../../contexts/auth"
import SimpleBar from "simplebar-react"

const AppRoot: Component = () => {
  const authContext = useAuthContext("dont_know")

  if (!authContext.authenticated) return <Navigate to="/" />

  return (
    <>
      <SimpleBar style={{ height: "100%", maxHeight: "736px" }}>
        <Outlet />
      </SimpleBar>
      <section className="absolute bottom-0 right-0 w-full">
        <DynamicPlayer />
        <NavBar />
      </section>
    </>
  )
}

export default AppRoot
