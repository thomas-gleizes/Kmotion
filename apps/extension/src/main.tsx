import React from "react"
import { createRoot } from "react-dom/client"
import App from "./App"

import "./styles/global.css"

const rootElement = document.getElementById("root") as Element

createRoot(rootElement).render(<App />)
