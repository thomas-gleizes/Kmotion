import React from "react"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { classValidatorResolver } from "@hookform/resolvers/class-validator"
import { toast } from "react-toastify"

import { LoginDto } from "@kmotion/validations"
import { LoginResponse } from "@kmotion/types"
import { api } from "../../utils/Api"
import { useUnAuthenticatedContext } from "../../contexts/auth"

const resolver = classValidatorResolver(LoginDto)

const defaultValues: LoginDto = {
  email: "",
  password: "",
}

const LoginForm: Component = () => {
  const { register, handleSubmit } = useForm<LoginDto>({ resolver, defaultValues })

  const authContext = useUnAuthenticatedContext()

  const mutation = useMutation<LoginResponse, unknown, LoginDto>({
    mutationFn: (data) => api.login(data),
    onSuccess: (resp) => authContext.login(resp.user, resp.token),
    onError: () => toast.error("Login/Mot de passe incorrect"),
  })

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
      <div className="flex flex-col space-y-5">
        <div className="flex items-center h-auto">
          <div className="py-2 bg-gradient-to-bl from-blue-600 to-blue-900 rounded-l-md px-3 w-fit">
            <label htmlFor="email" className="font-semibold text-lg">
              Email
            </label>
          </div>
          <input
            {...register("email")}
            id="email"
            type="email"
            placeholder="example@kmotion.fr"
            className="text-black w-full px-4 py-2 rounded-r-md bg-gray-200 text-lg"
          />
        </div>
        <div className="flex items-center h-auto">
          <div className="h-full py-2 bg-gradient-to-bl from-blue-600 to-blue-900 rounded-l-md px-3 w-fit">
            <label htmlFor="password" className="font-semibold text-lg">
              Password
            </label>
          </div>
          <input
            {...register("password")}
            id="password"
            type="password"
            placeholder="*****"
            className="text-black w-full px-4 py-2 rounded-r-md bg-gray-200 text-lg"
          />
        </div>
      </div>
      <div className="mt-8">
        <div className="">
          {mutation.isLoading ? (
            <button className="btn btn-block loading text-gray-800" disabled>
              Chargement
            </button>
          ) : (
            <button className="btn btn-block bg-gradient-to-bl from-blue-600 to-blue-900 shadow border-800 transition transform hover:scale-105">
              Connexion
            </button>
          )}
        </div>
      </div>
    </form>
  )
}

export default LoginForm
