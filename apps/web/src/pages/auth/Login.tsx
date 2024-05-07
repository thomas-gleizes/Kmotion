import React from "react"
import { Link } from "@tanstack/react-router"

import LoginForm from "../../components/forms/LoginForm"

const LoginPage: Page = () => {
  return (
    <div className="flex flex-col space-y-10">
      <div className="">
        <p className="text-white/70">Connexion</p>
        <h2 className="text-xl font-bold">
          Rejoignez <span className="">Kmotion</span>
        </h2>
      </div>
      <LoginForm />
      <div className="flex items-center justify-between mt-5">
        <div>
          <Link to="/auth/register" className="text-sm text-blue-600 hover:underline">
            Pas encore inscrit ?
          </Link>
        </div>
        {/*<div>*/}
        {/*  <Link to="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">*/}
        {/*    mot de passe oublié ?*/}
        {/*  </Link>*/}
        {/*</div>*/}
      </div>
    </div>
  )
}

export default LoginPage
