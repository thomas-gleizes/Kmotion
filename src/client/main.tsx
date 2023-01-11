import React from "react"
import ReactDom from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"

import routes from "client/routes"

const props = JSON.parse(document.getElementById("app-data")?.textContent || "{}")

const ClientApp = () => {
  const router = createBrowserRouter(routes)

  return <RouterProvider router={router} />
}

if (true) {
  ReactDom.createRoot(document.getElementById("root") as HTMLElement).render(<ClientApp />)
} else {
  ReactDom.hydrateRoot(document.getElementById("root") as HTMLElement, <ClientApp />)
}
