import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { RouterProvider } from "@tanstack/react-router"
import { DialogProvider } from "react-dialog-promise"
import { queryClient } from "./queryClient.ts"
import { router } from "./router.ts"
import { PlayerProvider } from "./player/PlayerContext.tsx"
import { ThemeProvider } from "./theme/ThemeContext.tsx"

import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <PlayerProvider>
          <DialogProvider>
            <RouterProvider router={router} />
          </DialogProvider>
        </PlayerProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
)
