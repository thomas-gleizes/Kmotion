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
  email: "invite@kmotion.fr",
  password: "invite123",
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

      console.log("Response.data", response.data)

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
        <div className="space-y-4">
          <div className="">
            <label className="text-white font-semibold text-xl mb-1 mx-2">Email</label>
            <div className="bg-white rounded-lg px-3 py-1">
              <input
                type="email"
                className="text-lg text-black bg-transparent outline-none px-2"
                {...register("email")}
              />
            </div>
          </div>
          <div className="">
            <label className="text-white font-semibold text-xl mb-1 mx-2">Email</label>
            <div className="bg-white rounded-lg px-3 py-1">
              <input
                type="password"
                className="text-lg text-black bg-transparent outline-none px-2"
                {...register("password")}
              />
            </div>
          </div>
        </div>

        <div className="">
          {isSubmitting ? (
            <button className="btn btn-block loading text-gray-800" disabled>
              Chargement
            </button>
          ) : (
            <button className="py-2 px-5 text-xl text-white bg-gradient-to-bl from-blue-600 to-blue-900 shadow border-800 rounded-xl transition transform hover:scale-105">
              Connexion
            </button>
          )}
        </div>
      </div>
    </form>
  )
}

export default LoginForm
