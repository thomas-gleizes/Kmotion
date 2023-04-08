import React from "react"
import { QueryClientProvider } from "@tanstack/react-query"

import { queryClient } from "./queryClient"
import AuthProvider from "./contexts/auth"
import RouterProvider from "./contexts/router"
import { routes } from "./routes"

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider routes={Object.values(routes)} />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
