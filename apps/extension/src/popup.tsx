import ReactDOM from "react-dom/client"
import { PopupApp } from "./components/PopupApp"
import "./index.css"

const root = document.getElementById("root")
if (root) {
  ReactDOM.createRoot(root).render(<PopupApp />)
}
