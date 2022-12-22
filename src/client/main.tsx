import React from "react"
import ReactDom from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import App from "client/App"

const pageProps = JSON.parse(document.getElementById("app-data")?.textContent || "{}")

const ClientApp = () => {
  return (
    <BrowserRouter>
      <App pageProps={pageProps} />
    </BrowserRouter>
  )
}

ReactDom.hydrateRoot(document.getElementById("root") as Element, <ClientApp />)
