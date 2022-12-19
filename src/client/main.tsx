import React from "react"
import ReactDom from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import App from "client/App"

ReactDom.hydrateRoot(
  document.getElementById("root") as Element,
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
