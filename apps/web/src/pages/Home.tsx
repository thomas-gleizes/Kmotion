import React from "react"

import { useAuthContext } from "../contexts/auth"
import UnauthenticatedHome from "../components/common/UnauthenticatedHome"
import { Navigate } from "@tanstack/react-router"

const HomePage: Page = () => {
  const authContext = useAuthContext()

  if (!authContext.authenticated) return <UnauthenticatedHome />

  return <Navigate to="/app/playlists" />
}

export default HomePage
