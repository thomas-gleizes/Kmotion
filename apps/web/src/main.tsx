import React from "react";
import ReactDom from "react-dom/client";
import App from "./App";

const root = document.getElementById("root") as Element;

ReactDom.createRoot(root).render(<App />);
