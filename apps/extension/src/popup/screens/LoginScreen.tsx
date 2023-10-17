import React from "react"
import LoginForm from "../components/forms/LoginForm"
import { useAuthContext } from "../contexts/auth"
import { useRouterContext } from "../contexts/router"
import { routes } from "../routes"
import Header from "../components/common/Header"

const LoginScreen: React.FC = () => {
  const { isAuthenticated } = useAuthContext()
  const router = useRouterContext()

  if (isAuthenticated) router.push(routes.video)

  return (
    <>
      <Header color="dark" />
      <div className="w-full mt-7">
        <h2 className="text-center text-2xl font-semibold">Connexion</h2>
        <LoginForm />
      </div>
    </>
  )
}

export default LoginScreen
