import React from "react"
import { useForm } from "react-hook-form"
import { classValidatorResolver } from "@hookform/resolvers/class-validator"
import { Link } from "@tanstack/react-router"
import { LoginDto } from "@kmotion/validations"

const resolver = classValidatorResolver(LoginDto)

const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>({ resolver })

  const onSubmit = async (data: LoginDto) => {}

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col space-y-3">
        <div>
          <label>Email</label>
          <input type="email" placeholder="example@email.com" {...register("email")} />
          {errors.email && <div>{errors.email.message}</div>}
        </div>
        <div>
          <label>Mot de passe</label>
          <input type="password" placeholder="*****" {...register("password")} />
          {errors.password && <div>{errors.password.message}</div>}
        </div>
        <div className="mt-3">
          <button type="submit">Connexion</button>
        </div>
        <div className="flex items-center justify-between mt-5">
          <div>
            <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
              mot de passe oublié ?
            </Link>
          </div>
        </div>
      </div>
    </form>
  )
}

export default LoginForm
