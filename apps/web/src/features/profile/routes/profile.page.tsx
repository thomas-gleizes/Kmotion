import { createRoute, Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { css } from "styled-system/css"
import { appLayoutRoute } from "@/app/routes/app.layout"
import { meQuery } from "@/features/auth/api/auth.queries"
import { logout } from "@/features/auth/auth"
import { Button } from "@/shared/ui/Button"
import { HeartIcon, PersonIcon, PlusIcon, ShieldIcon } from "@/shared/ui/icons"
import { pageHeading } from "@/shared/lib/styles"
import { ExtensionCard } from "@/features/profile/components/ExtensionCard"
import { EqualizerSettings } from "@/features/profile/components/EqualizerSettings"
import { ThemePicker } from "@/features/profile/components/ThemePicker"
import {
  avatar,
  badge,
  card,
  emailStyle,
  mobileLink,
  mobileLinks,
  nameStyle,
  sectionTitle,
} from "@/features/profile/profile.styles"

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

      <h2 className={sectionTitle}>Extension navigateur</h2>
      <ExtensionCard />

      <h2 className={sectionTitle}>Égaliseur</h2>
      <EqualizerSettings />

      <h2 className={sectionTitle}>Thème</h2>
      <ThemePicker />

      <nav className={mobileLinks}>
        <Link to="/liked" className={mobileLink}>
          <HeartIcon size={18} /> Titres likés
        </Link>
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
