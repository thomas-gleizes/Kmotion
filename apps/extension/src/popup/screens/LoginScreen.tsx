import React from "react"
import LoginForm from "../components/forms/LoginForm"
import { useAuthContext } from "../contexts/auth"
import { useRouterContext } from "../contexts/router"
import { routes } from "../routes"

const LoginScreen: React.FC = () => {
  const { isAuthenticated } = useAuthContext()
  const router = useRouterContext()

  if (isAuthenticated) router.push(routes.video)

  return (
    <div>
      <div className="text-center">
        <div>
          <h1 className="text-2xl font-bold">Kmotion</h1>
          <h2 className="text-black/70 text-lg font-semibold">Connexion</h2>
        </div>
      </div>
      <LoginForm />
    </div>
  )
}

export default LoginScreen
