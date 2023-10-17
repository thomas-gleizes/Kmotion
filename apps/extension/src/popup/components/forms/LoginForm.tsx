import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { classValidatorResolver } from "@hookform/resolvers/class-validator"
import { LoginDto } from "@kmotion/validations"

import { routes } from "../../routes"
import { useAuthContext } from "../../contexts/auth"
import { useRouterContext } from "../../contexts/router"
import { login } from "../../../utils/api"

const resolver = classValidatorResolver(LoginDto)

const defaultValues: LoginDto = {
  email: "",
  password: "",
}

const LoginForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const { register, handleSubmit } = useForm<LoginDto>({ resolver, defaultValues })

  const authContext = useAuthContext()
  const router = useRouterContext()

  const onSubmit = async (values: LoginDto) => {
    try {
      setIsSubmitting(true)
      const response = await login(values)

      console.log("Response", response)

      await authContext.login(response.data.user, response.data.token)
      router.push(routes.video)
    } catch (err) {
      console.log("Error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col space-y-2 w-11/12 mx-auto">
        <div className="space-y-2 mx-2">
          <div>
            <label className="text-black font-semibold text-xl mb-1">Email</label>
            <div className="bg-white rounded-lg py-1">
              <input
                type="email"
                placeholder="example@kmotion.fr"
                className="text-lg text-black bg-gray-100 border-2 border-blue-800 hover:border-blue-900 focus:border-blue-900 placeholder:opacity-75 shadow outline-none px-4 py-2 rounded w-full transition"
                {...register("email")}
              />
            </div>
          </div>
          <div>
            <label className="text-black font-semibold text-xl mb-1">Mot de passe</label>
            <div className="bg-white rounded-lg py-1">
              <input
                type="password"
                placeholder="*********"
                className="text-lg text-black bg-gray-100 border-2 border-blue-800 hover:border-blue-900 focus:border-blue-900 placeholder:opacity-75 shadow outline-none px-4 py-2 rounded w-full transition"
                {...register("password")}
              />
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center pb-5">
          <button
            disabled={isSubmitting}
            className="py-2 px-5 text-xl text-white bg-gradient-to-bl from-blue-600 to-blue-900 shadow border-800 rounded-md transition transform hover:scale-105 disabled:bg-gray-600"
          >
            {isSubmitting ? "Chargement" : "Connexion"}
          </button>
        </div>
      </div>
    </form>
  )
}

export default LoginForm
