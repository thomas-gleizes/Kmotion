import React from "react"

import Login from "client/pages/Login"
import NotFound from "client/pages/NotFound"

interface Route {
  path: string
  page: Component
}

const routes: Array<Route> = [
  { path: "/", page: Login },
  { path: "/*", page: NotFound }
]

export default routes
