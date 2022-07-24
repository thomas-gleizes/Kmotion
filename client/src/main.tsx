import React from "react";
import { createRoot } from "react-dom/client";

import "./styles/index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root") as Element).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
