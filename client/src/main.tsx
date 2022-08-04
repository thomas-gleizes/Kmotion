import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import "./styles/index.css";
import App from "./App";

createRoot(document.getElementById("root") as Element).render(
  <BrowserRouter>
    <App />
    <ToastContainer position="top-center" autoClose={5000} pauseOnFocusLoss draggable closeOnClick />
  </BrowserRouter>
);
