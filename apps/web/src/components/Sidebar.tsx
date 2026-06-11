import { Link } from "@tanstack/react-router"
import { css, cx } from "styled-system/css"
import { getCurrentUser, logout } from "../auth/auth"
import { truncate } from "../lib/styles"
import { ListIcon, MusicNoteIcon, PersonIcon, PlusIcon, SearchIcon, ShieldIcon } from "./icons"

const sidebar = css({
  gridArea: "sidebar",
  display: "flex",
  flexDirection: "column",
  padding: "20px 12px",
  backgroundColor: "rgba(18, 18, 20, 0.85)",
  backdropFilter: "blur(20px) saturate(180%)",
  borderRight: "1px solid token(colors.border)",
})

const brand = css({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "8px 12px 24px",
  fontSize: "22px",
  fontWeight: "800",
  letterSpacing: "-0.5px",
  color: "accent",
})

const navLink = css({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "10px 12px",
  borderRadius: "s",
  fontSize: "15px",
  fontWeight: "500",
  color: "textSecondary",
  transition: "all token(durations.fast) token(easings.apple)",
  _hover: { backgroundColor: "rgba(255, 255, 255, 0.06)", color: "text" },
  '&[data-status="active"]': {
    backgroundColor: "surfaceRaised",
    color: "accent",
  },
})

const footer = css({
  marginTop: "auto",
  borderTop: "1px solid token(colors.border)",
  paddingTop: "14px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
})

const userName = cx(truncate, css({ fontSize: "14px", fontWeight: "600", padding: "0 12px" }))

const logoutButton = css({
  textAlign: "left",
  padding: "6px 12px",
  fontSize: "13px",
  color: "textSecondary",
  cursor: "pointer",
  background: "none",
  border: "none",
  borderRadius: "s",
  fontFamily: "sans",
  _hover: { color: "danger", backgroundColor: "rgba(255, 69, 58, 0.1)" },
})

export function Sidebar() {
  const user = getCurrentUser()

  return (
    <aside className={sidebar}>
      <div className={brand}>
        <MusicNoteIcon size={26} />
        Kmotion
      </div>
      <nav className={css({ display: "flex", flexDirection: "column", gap: "2px" })}>
        <Link to="/" className={navLink}>
          <MusicNoteIcon size={18} /> Écouter
        </Link>
        <Link to="/search" className={navLink}>
          <SearchIcon size={18} /> Rechercher
        </Link>
        <Link to="/playlists" className={navLink}>
          <ListIcon size={18} /> Playlists
        </Link>
        <Link to="/add" className={navLink}>
          <PlusIcon size={18} /> Ajouter
        </Link>
        <Link to="/profile" className={navLink}>
          <PersonIcon size={18} /> Profil
        </Link>
        {user?.isAdmin && (
          <Link to="/admin" className={navLink}>
            <ShieldIcon size={18} /> Admin
          </Link>
        )}
      </nav>
      <div className={footer}>
        <div className={userName}>{user?.name}</div>
        <button type="button" className={logoutButton} onClick={logout}>
          Se déconnecter
        </button>
      </div>
    </aside>
  )
}
