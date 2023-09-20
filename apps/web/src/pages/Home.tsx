import React from "react"
import { Navigate } from "@tanstack/react-router"

import { useAuthContext } from "../contexts/auth"
import UnauthenticatedHome from "../components/common/UnauthenticatedHome"

const HomePage: Page = () => {
  const authContext = useAuthContext()

  if (!authContext.authenticated) return <UnauthenticatedHome />

  return <Navigate to="/app/playlists" />
}

export default HomePage
