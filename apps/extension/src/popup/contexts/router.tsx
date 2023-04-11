import React, { createContext, useState } from "react"
import { routes } from "../routes"

interface Values {
  push: (route: Route) => void
}

const RouterContext = createContext<Values>(null as never)

export const useRouterContext = () => {
  const context = React.useContext(RouterContext)

  if (!context) throw new Error('"useRouterContext" must be used within a "RouterProvider"')

  return context
}

const RouterProvider: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<Route>(routes.login)

  console.log("CurrentRoute", currentRoute)

  const push = (route: Route) => {
    setCurrentRoute(route)
  }

  return (
    <RouterContext.Provider value={{ push }}>
      <currentRoute.root>
        <currentRoute.screen />
      </currentRoute.root>
    </RouterContext.Provider>
  )
}

export default RouterProvider
