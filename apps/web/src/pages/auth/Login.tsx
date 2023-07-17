import React from "react"
import { Link } from "@tanstack/react-router"

import LoginForm from "../../components/forms/LoginForm"
import { css } from "../../../styled-system/css"

const LoginPage: Page = () => {
  return (
    <div className={css({ display: "flex", flexDirection: "column", rowGap: "10" })}>
      <div>
        <p className={css({ color: "white.200" })}>Connexion</p>
        <h2 className={css({ fontSize: "xl", fontWeight: "bold" })}>
          Rejoignez <span className={css({ color: "blue.500" })}>Kmotion</span>
        </h2>
      </div>
      <LoginForm />
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mt: "5",
        })}
      >
        <div>
          <Link
            to="/auth/register"
            className={css({
              fontSize: "sm",
              color: "blue.600",
              _hover: {
                textDecoration: "underline",
              },
            })}
          >
            Pas encore inscrit ?
          </Link>
        </div>
        <div>
          <Link
            to="/auth/forgot-password"
            className={css({
              fontSize: "sm",
              color: "blue.600",
              _hover: {
                textDecoration: "underline",
              },
            })}
          >
            mot de passe oublié ?
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
