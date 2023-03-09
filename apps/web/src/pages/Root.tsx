import React from "react"
import { Outlet, SyncRouteComponent } from "@tanstack/react-router"

import Header from "../components/Header"
import ContextsProvider from "../contexts"

const Root: SyncRouteComponent = () => {
  return (
    <ContextsProvider>
      <div className="flex justify-center items-center w-screen h-screen bg-gray-900 shadow-2xl">
        <div className="mockup-phone">
          <div className="camera" />
          <div className="display relative">
            <div className="artboard artboard-demo phone-3 block bg-black">
              <Header />
              <div className="block h-full w-full">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 flex space-x-4">
        <button
          className="btn bg-blue-400"
          onClick={() => {
            localStorage.clear()
            window.location.reload()
          }}
        >
          Clear
        </button>
      </div>
    </ContextsProvider>
  )
}

export default Root
