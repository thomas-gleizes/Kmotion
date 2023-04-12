import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { classValidatorResolver } from "@hookform/resolvers/class-validator"
import { LoginDto } from "@kmotion/validations"

import { routes } from "../../routes"
import { useAuthContext } from "../../contexts/auth"
import { useRouterContext } from "../../contexts/router"

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
      const data = await fetch("http://localhost:8000/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-Type": "Application/json" },
      }).then((response) => response.json())

      await authContext.login(data.user, data.token)
      router.push(routes.convert)
    } catch (err) {
      console.log("Error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col space-y-2">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <label className="input-group">
            <span>Email</span>
            <input
              {...register("email")}
              type="text"
              placeholder="info@site.com"
              className="input input-bordered ring-0"
            />
          </label>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Mot de passe</span>
          </label>
          <label className="py-2 rounded-lg bg-white">
            <span>Password</span>
            <input
              {...register("password")}
              type="password"
              placeholder="info@site.com"
              className="px-3 text-lg bg-transparent outline-none"
            />
          </label>
        </div>
      </div>
      <div className="mt-5">
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
