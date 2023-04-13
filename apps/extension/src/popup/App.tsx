import React from "react"
import { QueryClientProvider } from "@tanstack/react-query"

import { queryClient } from "./queryClient"
import AuthProvider from "./contexts/auth"
import RouterProvider from "./contexts/router"
import AppRoot from "./layouts/AppRoot"

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRoot>
          <RouterProvider />
        </AppRoot>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
