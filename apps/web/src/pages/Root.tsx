import React from "react"
import { Outlet, SyncRouteComponent } from "@tanstack/react-router"
import { ToastContainer } from "react-toastify"

import ContextsProvider from "../contexts"
import Header from "../components/common/Header"

const Root: SyncRouteComponent = () => {
  return (
    <>
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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  )
}

export default Root
