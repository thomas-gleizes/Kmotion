import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { classValidatorResolver } from "@hookform/resolvers/class-validator"
import { Navigate } from "@tanstack/react-router"
import { LoginDto } from "@kmotion/validations"

import { api } from "../../utils/Api"
import { useAuthContext } from "../../contexts/auth"

const resolver = classValidatorResolver(LoginDto)

const defaultValues: LoginDto = {
  email: "kalat@kmotion.fr",
  password: "azerty123",
}

const LoginForm: Component = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const { register, handleSubmit } = useForm<LoginDto>({ resolver, defaultValues })

  const authContext = useAuthContext()

  if (authContext.authenticated) return <Navigate to="/" />
  const onSubmit = async (data: LoginDto) => {
    try {
      setIsSubmitting(true)
      const response = await api.login(data)

      authContext.login(response.user)
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
          <label className="input-group">
            <span>Password</span>
            <input
              {...register("password")}
              type="password"
              placeholder="info@site.com"
              className="input input-bordered ring-0"
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
