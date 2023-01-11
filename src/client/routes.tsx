import React from "react"
import { RouteObject } from "react-router-dom"
import Layout from "client/components/layouts/Layout"
import Login from "client/pages/auth/Login"
import createRoute from "client/utils/createRoute"
import Register from "client/pages/auth/Register"

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "auth",
        children: [createRoute("login", Login), createRoute("register", Register)]
      }
    ]
  }
]

export default routes
