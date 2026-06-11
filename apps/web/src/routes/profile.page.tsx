import { createRoute, Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { css } from "styled-system/css"
import { appLayoutRoute } from "./app.layout"
import { meQuery } from "../api/queries"
import { logout } from "../auth/auth"
import { Button } from "../components/Button"
import { PersonIcon, PlusIcon, ShieldIcon } from "../components/icons"
import { pageHeading } from "../lib/styles"

const card = css({
  maxWidth: "480px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
  padding: "36px 28px",
  borderRadius: "l",
  backgroundColor: "surface",
  border: "1px solid token(colors.border)",
})

const avatar = css({
  width: "84px",
  height: "84px",
  borderRadius: "full",
  backgroundColor: "surfaceRaised",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "textSecondary",
  marginBottom: "8px",
})

const nameStyle = css({ fontSize: "22px", fontWeight: "700" })
const emailStyle = css({ fontSize: "14px", color: "textSecondary" })
const badge = css({
  fontSize: "12px",
  color: "accent",
  backgroundColor: "rgba(250, 45, 72, 0.12)",
  padding: "3px 10px",
  borderRadius: "full",
  fontWeight: "600",
})

// Liens absents de la tab bar mobile (présents dans la sidebar desktop).
const mobileLinks = css({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  maxWidth: "480px",
  marginTop: "16px",
  md: { display: "none" },
})

const mobileLink = css({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "14px 16px",
  borderRadius: "s",
  fontSize: "15px",
  fontWeight: "500",
  color: "textSecondary",
  backgroundColor: "surface",
  border: "1px solid token(colors.border)",
  '&[data-status="active"]': { color: "accent" },
})

const ProfilePage = () => {
  const { data: user, isPending } = useQuery(meQuery)

  return (
    <div>
      <h1 className={pageHeading}>Profil</h1>
      <div className={card}>
        <div className={avatar}>
          <PersonIcon size={40} />
        </div>
        {isPending && <div className={emailStyle}>Chargement…</div>}
        {user && (
          <>
            <div className={nameStyle}>{user.name}</div>
            <div className={emailStyle}>{user.email}</div>
            {user.isAdmin && <span className={badge}>Administrateur</span>}
          </>
        )}
        <div className={css({ marginTop: "16px" })}>
          <Button variant="danger" onClick={logout}>
            Se déconnecter
          </Button>
        </div>
      </div>

      <nav className={mobileLinks}>
        <Link to="/add" className={mobileLink}>
          <PlusIcon size={18} /> Ajouter un titre
        </Link>
        {user?.isAdmin && (
          <Link to="/admin" className={mobileLink}>
            <ShieldIcon size={18} /> Administration
          </Link>
        )}
      </nav>
    </div>
  )
}

export const profileRoute = createRoute({
  path: "/profile",
  component: ProfilePage,
  getParentRoute: () => appLayoutRoute,
})
