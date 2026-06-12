import { useState, type FormEvent } from "react"
import { createRoute, Link, redirect } from "@tanstack/react-router"
import { useMutation } from "@tanstack/react-query"
import { css } from "styled-system/css"
import { rootRoute } from "../router"
import { api } from "../api/client"
import { isAuthenticated } from "../auth/auth"
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

const successTitle = css({ fontSize: "20px", fontWeight: "700", textAlign: "center" })

const successText = css({
  color: "textSecondary",
  fontSize: "14px",
  lineHeight: "1.5",
  textAlign: "center",
})

export const RegisterPage = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const register = useMutation({
    mutationFn: async () => {
      const { error, response } = await api.POST("/api/3.1/auth/register", {
        body: { name, email, password },
        parseAs: "text",
      })
      if (error !== undefined || !response.ok) throw new Error("Inscription impossible")
    },
  })

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    register.mutate()
  }

  if (register.isSuccess) {
    return (
      <div className={authPageStyle}>
        <div className={authCardStyle}>
          <div className={authBrandStyle}>
            <MusicNoteIcon size={28} />
            Kmotion
          </div>
          <div className={successTitle}>Compte créé !</div>
          <p className={successText}>
            Un administrateur doit activer votre compte avant que vous puissiez vous connecter.
            Vous pourrez vous connecter dès que ce sera fait.
          </p>
          <div className={authAltStyle}>
            <Link to="/login">Aller à la page de connexion</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={authPageStyle}>
      <form className={authCardStyle} onSubmit={onSubmit}>
        <div className={authBrandStyle}>
          <MusicNoteIcon size={28} />
          Kmotion
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
