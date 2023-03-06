import React from "react"
import ReactDom from "react-dom/client"
import "reflect-metadata"

import App from "./App"
import "./styles/global.css"

const root = document.getElementById("root") as Element

ReactDom.createRoot(root).render(<App />)