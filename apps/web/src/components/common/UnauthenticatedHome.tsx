import React from "react"
import { Link } from "@tanstack/react-router"

const UnauthenticatedHome: Component = () => {
  return (
    <div className="flex items-center justify-center h-full text-white space-x-10">
      <Link to="/auth/login">Connexion</Link>
      <Link to="/auth/register">Inscription</Link>
    </div>
  )
}

export default UnauthenticatedHome
