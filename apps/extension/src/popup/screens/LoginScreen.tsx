import React from "react"
import LoginForm from "../components/forms/LoginForm"
import { useAuthContext } from "../contexts/auth"
import { useRouterContext } from "../contexts/router"
import { routes } from "../routes"

const LoginScreen: React.FC = () => {
  const { isAuthenticated } = useAuthContext()
  const router = useRouterContext()

  if (isAuthenticated) router.push(routes.convert)

  return (
    <div>
      <h1 className="text-white">LOGIN</h1>
      <LoginForm />
    </div>
  )
}

export default LoginScreen
