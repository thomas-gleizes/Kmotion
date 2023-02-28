import React from "react";
import ReactDom from "react-dom/client";

const root = document.getElementById("root") as Element;

ReactDom.createRoot(root).render(
  <div>
    <h1>hello world</h1>
  </div>
);
