import React from "react"
import { Outlet, SyncRouteComponent } from "@tanstack/react-router"

const OtherRoot: SyncRouteComponent = () => {
  return (
    <section className="h-full h-full flex flex-col items-center justify-center">
      <Outlet />
    </section>
  )
}

export default OtherRoot
