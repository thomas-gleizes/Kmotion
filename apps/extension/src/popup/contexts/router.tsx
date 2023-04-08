import React, { createContext, useMemo, useState } from "react"

interface Values {
  push: (route: string) => void
}

const RouterContext = createContext<Values>(null as never)

export const useRouterContext = () => {
  const context = React.useContext(RouterContext)

  if (!context) throw new Error('"useRouterContext" must be used within a "RouterProvider"')

  return context
}

const RouterProvider: React.FC<{ routes: Array<any> }> = ({ routes }) => {
  const [route, setRoute] = useState<string>(routes.find((route) => route.default).name)

  const Screen = useMemo(() => {
    const route = routes.find((route) => route.name === route)

    if (route) return route.screen
    else return routes.find((route) => route.default).screen
  }, [routes, route])

  console.log("Screen", route, Screen)

  return <RouterContext.Provider value={{ push: setRoute }}>{<Screen />}</RouterContext.Provider>
}

export default RouterProvider
