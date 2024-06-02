import React, { createContext, useState } from "react"

import { useAuthContext } from "./auth"
import { routes } from "../routes"

interface Values {
  push: (route: Route) => void
  current: Route
}

const RouterContext = createContext<Values>(null as never)

export const useRouterContext = () => {
  const context = React.useContext(RouterContext)

  if (!context) throw new Error('"useRouterContext" must be used within a "RouterProvider"')

  return context
}

const RouterProvider: React.FC = () => {
  const { isAuthenticated } = useAuthContext()

  const [currentRoute, setCurrentRoute] = useState<Route>(routes.login)

  const push = (route: Route) => {
    setCurrentRoute(route)
  }

  if (currentRoute.needAuth && !isAuthenticated) push(routes.login)

  return (
    <RouterContext.Provider value={{ push, current: currentRoute }}>
      <currentRoute.root>
        <currentRoute.screen />
      </currentRoute.root>
    </RouterContext.Provider>
  )
}

export default RouterProvider
