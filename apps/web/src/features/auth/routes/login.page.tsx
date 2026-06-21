import { useState, type FormEvent } from "react"
import { createRoute, Link, redirect, useNavigate } from "@tanstack/react-router"
import { useMutation } from "@tanstack/react-query"
import { css } from "styled-system/css"
import { rootRoute } from "@/app/router"
import { api } from "@/shared/api/client"
import { isAuthenticated, setToken } from "@/features/auth/auth"
import { Button } from "@/shared/ui/Button"
import { TextField } from "@/shared/ui/TextField"
import { MusicNoteIcon } from "@/shared/ui/icons"

export const authPageStyle = css({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background:
    "radial-gradient(1200px 800px at 70% -10%, token(colors.accentGlow), transparent 60%), radial-gradient(900px 600px at 10% 110%, rgba(94, 92, 230, 0.15), transparent 60%), token(colors.bg)",
})

export const authCardStyle = css({
  width: "min(400px, calc(100vw - 32px))",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  padding: "36px 32px",
  borderRadius: "l",
  backgroundColor: "surfaceTranslucent",
  backdropFilter: "blur(20px) saturate(180%)",
  border: "1px solid token(colors.border)",
  boxShadow: "card",
  animation: "scaleIn token(durations.normal) token(easings.apple)",
})

export const authBrandStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  color: "accent",
  fontSize: "26px",
  fontWeight: "800",
  letterSpacing: "-0.5px",
  marginBottom: "4px",
})

export const authErrorStyle = css({
  color: "danger",
  fontSize: "13px",
  textAlign: "center",
})

export const authAltStyle = css({
  fontSize: "13px",
  color: "textSecondary",
  textAlign: "center",
  "& a": { color: "accent", fontWeight: "600" },
})

export const LoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const login = useMutation({
    mutationFn: async () => {
      const { data, error, response } = await api.POST("/api/3.1/auth/login", {
        body: { email, password },
        parseAs: "text",
      })
      if (error !== undefined || !response.ok) {
        if (String(error).includes("Account not activated")) {
          throw new Error("Votre compte n'a pas encore été activé par un administrateur.")
        }
        throw new Error("Identifiants invalides")
      }
      return data as string
    },
    onSuccess: (token) => {
      setToken(token)
      void navigate({ to: "/" })
    },
  })

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    login.mutate()
  }

  return (
    <div className={authPageStyle}>
      <form className={authCardStyle} onSubmit={onSubmit}>
        <div className={authBrandStyle}>
          <MusicNoteIcon size={28} />
          Kmotion
        </div>
        <TextField
          label="Adresse e-mail"
          type="email"
          required
          autoFocus
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <TextField
          label="Mot de passe"
          type="password"
          required
          minLength={8}
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {login.isError && <div className={authErrorStyle}>{login.error.message}</div>}
        <Button type="submit" disabled={login.isPending}>
          {login.isPending ? "Connexion…" : "Se connecter"}
        </Button>
        <div className={authAltStyle}>
          Pas encore de compte ? <Link to="/register">Créer un compte</Link>
        </div>
      </form>
    </div>
  )
}

export const loginRoute = createRoute({
  path: "/login",
  component: LoginPage,
  getParentRoute: () => rootRoute,
  beforeLoad: () => {
    if (isAuthenticated()) throw redirect({ to: "/" })
  },
})
