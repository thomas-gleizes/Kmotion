import React from "react"
import { Outlet, RouteComponent } from "@tanstack/react-router"

const OtherRoot: RouteComponent = () => {
  return (
    <section className="h-full h-full flex flex-col items-center justify-center">
      <Outlet />
    </section>
  )
}

export default OtherRoot
