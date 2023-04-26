import React from "react"
import { Link } from "@tanstack/react-router"

import RegisterForm from "../../components/forms/RegisterForm"

const RegisterPage: Page = () => {
  return (
    <div className="flex flex-col space-y-10">
      <div className="">
        <p className="text-white/70">Inscription</p>
        <h2 className="text-xl font-bold">
          Rejoignez <span className="">Kmotion</span>
        </h2>
      </div>
      <RegisterForm />
      <div className="flex items-center justify-between mt-5">
        <div>
          <Link to="/auth/login" className="text-sm text-blue-600 hover:underline">
            Déjà inscrit ?
          </Link>
        </div>
        <div>
          <Link to="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
            mot de passe oublié ?
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
