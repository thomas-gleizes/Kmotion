import React from "react"
import { Outlet, SyncRouteComponent } from "@tanstack/react-router"

import ContextsProvider from "../contexts"

const Root: SyncRouteComponent = () => {
  return (
    <ContextsProvider>
      <div className="flex justify-center items-center w-screen h-screen bg-black">
        <div className="mockup-phone">
          <div className="camera" />
          <div className="display">
            <div className="artboard artboard-demo phone-3">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </ContextsProvider>
  )
}

export default Root
