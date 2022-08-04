import React from "react";
import { Route, Routes } from "react-router-dom";

import { publicRoutes, privateRoutes } from "resources/routes";
import { useAuthContext } from "context/auth.context";
import PublicLayout from "components/layouts/pages/PublicLayout";
import PrivateLayout from "components/layouts/pages/PrivateLayout";

const Router: Component = () => {
  const ctx = useAuthContext();

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        {Object.values(publicRoutes).map((route, index) => (
          <Route key={index} path={route.path} element={<route.component />} />
        ))}
      </Route>
      {ctx.isAuthenticated && (
        <Route element={<PrivateLayout />}>
          {Object.values(privateRoutes).map((route, index) => (
            <Route key={index} path={route.path} element={<route.component />} />
          ))}
        </Route>
      )}
    </Routes>
  );
};

export default Router;
