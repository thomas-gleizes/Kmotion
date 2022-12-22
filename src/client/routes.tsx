import React from "react"

import * as Login from "client/pages/Login"
import * as NotFound from "client/pages/NotFound"
import { Route } from "types"

const routes: Array<Route> = [
  { path: "/", component: Login.default, serverSideProps: Login.serverSideProps },
  { path: "/*", component: NotFound.default }
]

export default routes
