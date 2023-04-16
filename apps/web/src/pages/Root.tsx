import React from "react"
import { Outlet, SyncRouteComponent } from "@tanstack/react-router"

import ContextsProvider from "../contexts"
import Header from "../components/common/Header"

const Root: SyncRouteComponent = () => {
  return (
    <ContextsProvider>
      <div className="flex items-center justify-center h-screen text-white/80">
        <div className="relative w-screen h-screen bg-black overflow-hidden">
          <Header />
          <div className="block h-full w-full">
            <Outlet />
          </div>
        </div>
      </div>
    </ContextsProvider>
  )
}

export default Root
