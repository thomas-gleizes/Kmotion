import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FiLoader } from "react-icons/fi"
import { loginSchema, LoginDto } from "../utils/validations"
import { api } from "../utils/api"
import { useAuthStore } from "../stores"
import { Button } from "./Button"

export const LoginForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginDto) => {
    setIsLoading(true)
    setError(null)
    try {
      const token = await api.login(data)
      await api.setToken(token)
      const user = await api.getProfile().catch(() => null)
      useAuthStore.getState().setSession(token, user)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de la connexion")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="h-full flex flex-col justify-center px-5"
      style={{
        background:
          "radial-gradient(600px 400px at 75% -10%, rgba(250, 45, 72, 0.22), transparent 60%), radial-gradient(500px 360px at 5% 115%, rgba(94, 92, 230, 0.18), transparent 60%), #0a0a0c",
      }}
    >
      <div className="rounded-l border border-hairline bg-surface-translucent shadow-card p-6 backdrop-blur-xl">
        <div className="flex items-center justify-center gap-2 mb-1 text-accent">
          <span className="text-3xl leading-none">♪</span>
          <h1 className="text-2xl font-extrabold tracking-tight">kMotion</h1>
        </div>
        <p className="text-[13px] text-ink-secondary text-center mb-5">
          Connectez-vous pour convertir vos vidéos.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
          <div>
            <label className="block text-[13px] font-medium mb-1.5 text-ink-secondary">
              Adresse e-mail
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="vous@exemple.com"
              className="w-full px-3 py-2 rounded-m bg-surface border border-hairline text-ink placeholder:text-ink-tertiary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/40 transition"
            />
            {errors.email && (
              <p className="text-danger text-xs mt-1.5">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-[13px] font-medium mb-1.5 text-ink-secondary">
              Mot de passe
            </label>
            <input
              type="password"
              {...register("password")}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-m bg-surface border border-hairline text-ink placeholder:text-ink-tertiary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/40 transition"
            />
            {errors.password && (
              <p className="text-danger text-xs mt-1.5">{errors.password.message}</p>
            )}
          </div>

          {error && <p className="text-danger text-[13px] text-center">{error}</p>}

          <Button type="submit" disabled={isLoading} className="w-full py-2.5">
            {isLoading && <FiLoader className="animate-spin" size={16} />}
            {isLoading ? "Connexion…" : "Se connecter"}
          </Button>
        </form>
      </div>
    </div>
  )
}
