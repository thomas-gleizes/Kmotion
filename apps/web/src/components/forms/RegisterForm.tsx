import React from "react"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import classnames from "classnames"
import { classValidatorResolver } from "@hookform/resolvers/class-validator"

import { RegisterDto } from "@kmotion/validations"
import { RegisterResponse } from "@kmotion/types"
import { api } from "../../utils/Api"

const resolver = classValidatorResolver(RegisterDto)

const defaultValues: RegisterDto = {
  email: "",
  name: "",
  password: "",
}

const RegisterForm: Component = () => {
  const { register, handleSubmit } = useForm<RegisterDto>({ resolver, defaultValues })

  const registerMutation = useMutation<RegisterResponse, unknown, RegisterDto>({
    mutationFn: (payload) => api.register(payload),
    onSuccess: (response) => {
      console.log("Success:", response)
    },
  })

  return (
    <form onSubmit={handleSubmit((data) => registerMutation.mutateAsync(data))}>
      <div className="flex flex-col space-y-5">
        <div className="flex items-center h-auto">
          <div className="h-full py-2 bg-gradient-to-bl from-blue-600 to-blue-900 rounded-l-md px-3 w-fit">
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
            <label htmlFor="pseudo" className="font-semibold text-lg">
              username
            </label>
          </div>
          <input
            {...register("name")}
            id="name"
            type="text"
            placeholder="Kalat"
            className="text-black w-full px-4 py-2 rounded-r-md bg-gray-200 text-lg"
          />
        </div>

        <div className="flex items-center h-auto">
          <div className="h-full py-2 bg-gradient-to-bl from-blue-600 to-blue-900 rounded-l-md px-3 w-fit">
            <label htmlFor="password" className="font-semibold font-semibold text-lg">
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
      <div className="mt-5">
        <div className="">
          {registerMutation.isLoading ? (
            <button className="btn btn-block loading text-gray-800" disabled>
              Chargement
            </button>
          ) : (
            <button
              type="submit"
              className={classnames(
                "btn btn-block shadow border-800 transition transform hover:scale-105",
                registerMutation.isLoading
                  ? "loading text-gray-800"
                  : " bg-gradient-to-bl from-blue-600 to-blue-900 border-800",
              )}
            >
              S'inscrire
            </button>
          )}
        </div>
      </div>
    </form>
  )
}

export default RegisterForm
