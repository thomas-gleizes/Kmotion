import { useState, type FormEvent } from "react"
import { createRoute, Link, redirect, useNavigate } from "@tanstack/react-router"
import { useMutation } from "@tanstack/react-query"
import { rootRoute } from "../router"
import { api } from "../api/client"
import { isAuthenticated, setToken } from "../auth/auth"
import { Button } from "../components/Button"
import { TextField } from "../components/TextField"
import { MusicNoteIcon } from "../components/icons"
import {
  authAltStyle,
  authBrandStyle,
  authCardStyle,
  authErrorStyle,
  authPageStyle,
} from "./login.page"

export const RegisterPage = () => {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const register = useMutation({
    mutationFn: async () => {
      const { data, error, response } = await api.POST("/api/3.1/auth/register", {
        body: { name, email, password },
        parseAs: "text",
      })
      if (error !== undefined || !response.ok) throw new Error("Inscription impossible")
      return data as string
    },
    onSuccess: (token) => {
      setToken(token)
      void navigate({ to: "/" })
    },
  })

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    register.mutate()
  }

  return (
    <div className={authPageStyle}>
      <form className={authCardStyle} onSubmit={onSubmit}>
        <div className={authBrandStyle}>
          <MusicNoteIcon size={28} />
          Motio
        </div>
        <TextField
          label="Nom"
          required
          autoFocus
          minLength={3}
          maxLength={255}
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <TextField
          label="Adresse e-mail"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <TextField
          label="Mot de passe"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {register.isError && <div className={authErrorStyle}>{register.error.message}</div>}
        <Button type="submit" disabled={register.isPending}>
          {register.isPending ? "Création…" : "Créer un compte"}
        </Button>
        <div className={authAltStyle}>
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </div>
      </form>
    </div>
  )
}

export const registerRoute = createRoute({
  path: "/register",
  component: RegisterPage,
  getParentRoute: () => rootRoute,
  beforeLoad: () => {
    if (isAuthenticated()) throw redirect({ to: "/" })
  },
})
