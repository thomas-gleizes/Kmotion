import React from "react";
import { Route, Routes } from "react-router-dom";
import { publicRoutes, protectedRoutes } from "resources/routes";

import PublicLayout from "components/layouts/public.layout";
import ProtectedLayout from "components/layouts/protected.layout";

const Router: Component = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        {Object.values(publicRoutes).map((route, index) => (
          <Route key={index} path={route.path} element={<route.component />} />
        ))}
      </Route>
      <Route element={<ProtectedLayout />}>
        {Object.values(protectedRoutes).map((route, index) => (
          <Route key={index} path={route.path} element={<route.component />} />
        ))}
      </Route>
    </Routes>
  );
};

export default Router;
