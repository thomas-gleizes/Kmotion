import React from "react"

import HomePage from "client/pages/HomePage"

interface Route {
  path: string
  page: React.FC
}

const routes: Array<Route> = [
  { path: "/", page: HomePage },
  { path: "/home", page: HomePage }
]

export default routes
