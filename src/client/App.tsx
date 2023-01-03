import React, { useEffect } from "react"
import { Route, Routes } from "react-router-dom"

import { AppComponent, GetInitialAppProps, TUser } from "types"
import routes from "client/routes"
import Layout from "client/components/layouts/Layout"
import useAuthStore from "client/stores/auth"

interface InitialAppProps {
  user?: TUser
}

export const getInitialAppProps: GetInitialAppProps<InitialAppProps> = (request) => {
  return { user: request.session.user || null }
}

const App: AppComponent<InitialAppProps> = ({ pageProps, appProps }) => {
  const login = useAuthStore((state) => state.login)

  useEffect(() => appProps.user && login(appProps.user), [appProps])

  return (
    <Layout>
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={<route.component {...pageProps} />} />
        ))}
      </Routes>
    </Layout>
  )
}

export default App
