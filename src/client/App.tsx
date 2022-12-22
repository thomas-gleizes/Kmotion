import React from "react"
import { Route, Routes } from "react-router-dom"

import routes from "client/routes"
import Layout from "client/components/layouts/Layout"
import ContextsProvider from "client/contexts"

interface Props {
  pageProps: any
}

const App: Component<Props> = ({ pageProps }) => {
  return (
    <ContextsProvider>
      <Layout>
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.component {...pageProps} />}
            />
          ))}
        </Routes>
      </Layout>
    </ContextsProvider>
  )
}

export default App
