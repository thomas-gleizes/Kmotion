import React from "react"
import { RouteObject } from "react-router-dom"

import createRoute from "client/utils/createRoute"
import Layout from "client/components/layouts/Layout"
import Login from "client/pages/auth/Login"
import Register from "client/pages/auth/Register"
import Home from "client/pages/protected/Home"
import AuthLayout from "client/components/layouts/AuthLayout"
import ProtectedLayout from "client/components/layouts/ProtectedLayout"
import NotFound from "client/pages/NotFound"

const routes: RouteObject[] = [
  createRoute("/", Layout, {
    children: [
      createRoute("auth", AuthLayout, {
        children: [createRoute("login", Login), createRoute("register", Register)],
        errorElement: <NotFound />
      }),
      createRoute("app", ProtectedLayout, {
        children: [createRoute("home", Home)],
        errorElement: <NotFound />
      })
    ]
  })
]

export default routes
