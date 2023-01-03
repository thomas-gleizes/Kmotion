import React from "react"
import ReactDom from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import App from "client/App"

const props = JSON.parse(document.getElementById("app-data")?.textContent || "{}")

const ClientApp = () => {
  console.log("Props", props)

  return (
    <BrowserRouter>
      <App {...props} />
    </BrowserRouter>
  )
}

ReactDom.hydrateRoot(document.getElementById("root") as Element, <ClientApp />)
