import React from "react";
import { Outlet } from "@tanstack/react-router";

export default function Root() {
  return <div>
    <Outlet />
  </div>;
}
