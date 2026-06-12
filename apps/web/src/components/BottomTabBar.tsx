import { Link } from "@tanstack/react-router"
import { css } from "styled-system/css"
import { ListIcon, MusicNoteIcon, PersonIcon, SearchIcon } from "./icons"

const bar = css({
  gridArea: "tabbar",
  display: "flex",
  backgroundColor: "chromeTranslucent",
  backdropFilter: "blur(20px) saturate(180%)",
  borderTop: "1px solid token(colors.border)",
  paddingBottom: "env(safe-area-inset-bottom)",
})

const tabLink = css({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "3px",
  minHeight: "56px",
  fontSize: "10px",
  fontWeight: "600",
  color: "textSecondary",
  transition: "color token(durations.fast) token(easings.apple)",
  '&[data-status="active"]': { color: "accent" },
})

export function BottomTabBar() {
  return (
    <nav className={bar}>
      <Link to="/" className={tabLink}>
        <MusicNoteIcon size={22} /> Écouter
      </Link>
      <Link to="/search" className={tabLink}>
        <SearchIcon size={22} /> Rechercher
      </Link>
      <Link to="/playlists" className={tabLink}>
        <ListIcon size={22} /> Playlists
      </Link>
      <Link to="/profile" className={tabLink}>
        <PersonIcon size={22} /> Profil
      </Link>
    </nav>
  )
}
