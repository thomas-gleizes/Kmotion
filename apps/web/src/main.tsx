import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { RouterProvider } from "@tanstack/react-router"
import { DialogProvider } from "react-dialog-promise"
import { queryClient } from "@/app/queryClient"
import { router } from "@/app/router"
import { PlayerProvider } from "@/features/player/state/PlayerContext"
import { ThemeProvider } from "@/shared/theme/ThemeContext"

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
