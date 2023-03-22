import React, { useState } from "react"
import { Outlet, SyncRouteComponent } from "@tanstack/react-router"
import { isMobile } from "react-device-detect"

import Header from "../components/common/Header"
import ContextsProvider from "../contexts"

const Root: SyncRouteComponent = () => {
  const [isMobileLayout, setIsMobileLayout] = useState(isMobile)

  return (
    <ContextsProvider>
      {isMobileLayout ? (
        <>
          <div className="flex items-center justify-center h-screen bg-gray-900">
            <div className="relative w-screen h-screen bg-black overflow-hidden">
              <Header />
              <div className="block h-full w-full">
                <Outlet />
              </div>
            </div>
          </div>
          <div className="fixed bottom-0 flex space-x-4">
            <button
              onClick={() => setIsMobileLayout(!isMobileLayout)}
              className="btn btn-xs bg-blue-400 text-black"
            >
              {isMobileLayout ? "Desktop" : "Mobile"}
            </button>
          </div>
        </>
      ) : (
        <>
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
          </div>{" "}
          <div className="fixed bottom-0 flex space-x-4">
            <button
              className="btn bg-blue-400"
              onClick={() => {
                localStorage.clear()
                window.location.href = "/"
              }}
            >
              Clear
            </button>
            <button
              className="btn bg-blue-400"
              onClick={() => {
                fetch("/api/v1/musics/sync")
                  .then((response) => response.json())
                  .then(console.log)
                  .catch(console.error)
              }}
            >
              SYNC
            </button>
            <button
              onClick={() => setIsMobileLayout(!isMobileLayout)}
              className="btn bg-blue-400 text-black"
            >
              {isMobileLayout ? "Desktop" : "Mobile"}
            </button>
          </div>
        </>
      )}
    </ContextsProvider>
  )
}

export default Root
