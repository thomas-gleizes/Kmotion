import React from "react"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { classValidatorResolver } from "@hookform/resolvers/class-validator"

import { LoginDto } from "@kmotion/validations"
import { LoginResponse } from "@kmotion/types"
import { api } from "../../utils/Api"
import { useUnAuthenticatedContext } from "../../contexts/auth"
import { css } from "../../../styled-system/css"

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
  })

  const inputClass = css({
    color: "black",
    w: "full",
    px: 4,
    py: 2,
    roundedRight: "md",
    bg: "gray.200",
    fontSize: "lg",
  })

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
      <div className={css({ display: "flex", flexDirection: "column", rowGap: "5" })}>
        <div className={css({ display: "flex", alignItems: "center", h: "auto" })}>
          <div
            className={css({
              w: "fit",
              py: 2,
              px: 3,
              roundedLeft: "md",
              backgroundGradient: "to-bl",
              gradientFrom: "blue.600",
              gradientTo: "blue.900",
            })}
          >
            <label htmlFor="email" className={css({ fontWeight: "semibold", fontSize: "lg" })}>
              Email
            </label>
          </div>
          <input
            {...register("email")}
            id="email"
            type="email"
            placeholder="example@kmotion.fr"
            className={inputClass}
          />
        </div>
        <div className={css({ display: "flex", alignItems: "center", h: "auto" })}>
          <div
            className={css({
              w: "fit",
              py: 2,
              px: 3,
              roundedLeft: "md",
              backgroundGradient: "to-bl",
              gradientFrom: "blue.600",
              gradientTo: "blue.900",
            })}
          >
            <label htmlFor="password" className={css({ fontWeight: "semibold", fontSize: "lg" })}>
              Password
            </label>
          </div>
          <input
            {...register("password")}
            id="password"
            type="password"
            placeholder="*****"
            className={inputClass}
          />
        </div>
      </div>
      <div className={css({ mt: 8 })}>
        <div>
          {mutation.isLoading ? (
            <button
              className={css({
                rounded: "lg",
                backgroundGradient: "to-bl",
                gradientFrom: "gray.600",
                gradientTo: "blue.900",
                color: "black",
                px: 3,
                py: 2,
              })}
            >
              Chargement ...
            </button>
          ) : (
            <button
              className={css({
                backgroundGradient: "to-bl",
                gradientFrom: "blue.600",
                gradientTo: "blue.900",
                color: "white",
                shadow: "md",
                w: "full",
                textAlign: "center",
                py: "2",
                rounded: "lg",
                _hover: {
                  scale: "1.05",
                },
                _disabled: {
                  gradientFrom: "gray.200",
                  gradientTo: "gray.500",
                },
              })}
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? "Chargement" : "Connexion"}
            </button>
          )}
        </div>
      </div>
    </form>
  )
}

export default LoginForm
