import React from "react"

import { Route } from "types"
import * as Login from "client/pages/Login"
import * as Home from "client/pages/Home"
import * as NotFound from "client/pages/NotFound"

const routes: Route<any, any>[] = [
  { path: "/login", component: Login.default, serverSideProps: Login.serverSideProps },
  { path: "/", component: Home.default, serverSideProps: Home.serverSideProps },
  { path: "/*", component: NotFound.default }
]

export default routes
