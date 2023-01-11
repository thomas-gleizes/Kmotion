import React from "react"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"

import { RegisterSchema } from "schemas/auth"
import { Page } from "types"

interface Schema extends RegisterSchema {
  confirmPassword: string
}

const RegisterPage: Page = () => {
  const { register, handleSubmit } = useForm<Schema>({
    defaultValues: { email: "", name: "", password: "" }
  })

  return (
    <div>
      <h2>Demande d'inscription</h2>

      <div className="flex justify-center items-center my-3">
        <Link
          to="/auth/login"
          className="bg-gradient-to-br from-blue-500 to-blue-700 px-3 py-1 font-medium rounded text-white"
        >
          Se connecter a K'motion
        </Link>
      </div>
    </div>
  )
}

export default RegisterPage
