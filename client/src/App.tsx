import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import routes from "resources/routes";

const App: Component = () => {
  return (
    <BrowserRouter>
      <Routes>
        {Object.entries(routes).map(([name, route], index) => (
          <Route key={`${name}-${index}`} path={route.path} element={<route.component />} />
        ))}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
