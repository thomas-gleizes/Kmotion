import React from "react"
import { Outlet, SyncRouteComponent } from "@tanstack/react-router"

import ContextsProvider from "../contexts"
import Header from "../components/common/Header"
import { css } from "../../styled-system/css"

const Root: SyncRouteComponent = () => {
  return (
    <ContextsProvider>
      <div
        className={css({
          display: "flex",
          justifyContent: "center",
          alignContent: "items-center",
          h: "screen",
          color: "white",
        })}
      >
        <div
          className={css({
            position: "relative",
            w: "screen",
            h: "screen",
            backgroundColor: "black",
            overflow: "hidden",
          })}
        >
          <Header />
          <div className={css({ display: "block", h: "full", w: "full" })}>
            <Outlet />
          </div>
        </div>
      </div>
    </ContextsProvider>
  )
}

export default Root
