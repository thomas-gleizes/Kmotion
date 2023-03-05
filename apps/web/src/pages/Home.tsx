import React from "react"

import { useAuthContext } from "../contexts/auth"
import UnauthenticatedHome from "../components/UnauthenticatedHome"
import DynamicPlayer from "../components/DynamicPlayer"

const HomePage: Page = () => {
  const authContext = useAuthContext("dont_know")

  if (!authContext.authenticated) return <UnauthenticatedHome />

  return (
    <div>
      <h1>Home page</h1>
      <DynamicPlayer />
    </div>
  )
}

export default HomePage
