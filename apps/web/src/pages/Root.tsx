import React from "react"
import { Outlet, RouteComponent, ScrollRestoration } from "@tanstack/react-router"
import { ToastContainer } from "react-toastify"

import ContextsProvider from "../contexts"
import Header from "../components/common/Header"

const Root: RouteComponent = () => {
  return (
    <>
      <ContextsProvider>
        <div
          className="flex items-center justify-center text-white/80"
          style={{ height: "100svh" }}
        >
          <div className="relative w-full h-full bg-black overflow-hidden">
            <Header />
            <div className="block h-full w-full">
              <ScrollRestoration />
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
