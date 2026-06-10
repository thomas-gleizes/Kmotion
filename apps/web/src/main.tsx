import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { RouterProvider } from "@tanstack/react-router"
import { queryClient } from "./queryClient.ts"
import { router } from "./router.ts"
import { PlayerProvider } from "./player/PlayerContext.tsx"

import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <PlayerProvider>
        <RouterProvider router={router} />
      </PlayerProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </StrictMode>,
)
