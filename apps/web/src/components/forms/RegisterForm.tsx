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
              className="input input-bordered"
            />
          </label>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Pseudo</span>
          </label>
          <label className="input-group">
            <span>Pseudo</span>
            <input
              {...register("name")}
              type="text"
              placeholder="kalat"
              className="input input-bordered"
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
              className="input input-bordered"
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
