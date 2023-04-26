import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { classValidatorResolver } from "@hookform/resolvers/class-validator"
import { RegisterDto } from "@kmotion/validations"
import classnames from "classnames"

import { api } from "../../utils/Api"

const resolver = classValidatorResolver(RegisterDto)

const defaultValues: RegisterDto = {
  email: "",
  name: "",
  password: "",
}

const RegisterForm: Component = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const { register, handleSubmit } = useForm<RegisterDto>({ resolver, defaultValues })

  const onSubmit = async (data: RegisterDto) => {
    try {
      setIsSubmitting(true)
      await api.register(data)
    } catch (err) {
      console.log("Error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col space-y-5">
        <div className="flex items-center h-auto">
          <div className="h-full py-2 bg-gradient-to-bl from-blue-600 to-blue-900 rounded-l-md px-3 w-fit">
            <label htmlFor="email" className="font-semibold font-semibold text-lg">
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
            <label htmlFor="pseudo" className="font-semibold font-semibold text-lg">
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
          {isSubmitting ? (
            <button className="btn btn-block loading text-gray-800" disabled>
              Chargement
            </button>
          ) : (
            <button
              type="submit"
              className={classnames(
                "btn btn-block shadow border-800 transition transform hover:scale-105",
                isSubmitting
                  ? "loading text-gray-800"
                  : " bg-gradient-to-bl from-blue-600 to-blue-900 border-800"
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
