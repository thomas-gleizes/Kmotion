import React from "react"
import { useForm } from "react-hook-form"

import { ServerSideProps, TUser } from "types"
import { LoginSchema } from "schemas/auth"
import useAuthStore from "client/stores/auth"

export const serverSideProps: ServerSideProps = async (request, reply) => {
  console.log("Request.session.isLogin", request.session.isLogin)

  if (request.session.isLogin) return reply.redirect("/playlist")

  return {
    props: {}
  }
}

const Login: Component = () => {
  const { register, handleSubmit } = useForm<LoginSchema>({
    defaultValues: { email: "kalat@kmotion.fr", password: "azerty" }
  })

  const login = useAuthStore((state) => state.login)

  const onSubmit = async (values: LoginSchema) => {
    try {
      const data: { user: TUser } = await fetch("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" }
      }).then((response) => response.json())

      login(data.user)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="px-6 py-10 h-full flex flex-col">
      <div className="text-center">
        <h1 className="text-xl font-semibold mt-1 mb-12 pb-1">K'Motion</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col space-y-3">
          <div>
            <h2>Connexion</h2>
          </div>
          <div className="flex flex-col space-y-4">
            <div>
              <label>Email</label>
              <input
                type="email"
                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                {...register("email")}
                placeholder="Email"
              />
            </div>
            <div>
              <label>Mot de passe</label>
              <input
                type="password"
                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                {...register("password")}
                placeholder="Mot de passe"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center space-y-3 mt-10">
          <div className="text-center cursor-pointer">
            <a className="text-gray-500">Mot de passe oublié ?</a>
          </div>
          <button
            type="submit"
            className="bg-gradient-to-br from-blue-500 to-blue-700 rounded shadow-lg active:shadow-2xl px-8 py-1 text-white font-medium text-lg"
          >
            Connexion
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login
