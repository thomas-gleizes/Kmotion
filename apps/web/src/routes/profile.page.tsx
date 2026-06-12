import { createRoute, Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { css, cx } from "styled-system/css"
import { appLayoutRoute } from "./app.layout"
import { meQuery } from "../api/queries"
import { logout } from "../auth/auth"
import { Button } from "../components/Button"
import { CheckIcon, PersonIcon, PlusIcon, ShieldIcon } from "../components/icons"
import { pageHeading } from "../lib/styles"
import { useTheme } from "../theme/ThemeContext"
import { themes } from "../theme/themes"
import {
  useAudioSettingsStore,
  CROSSFADE_MIN,
  CROSSFADE_MAX,
} from "../player/audioSettingsStore"

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
  backgroundColor: "accentSoft",
  padding: "3px 10px",
  borderRadius: "full",
  fontWeight: "600",
})

const sectionTitle = css({ fontSize: "16px", fontWeight: "700", margin: "28px 0 12px" })

const themeGrid = css({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
  gap: "12px",
  maxWidth: "480px",
})

const themeCard = css({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  padding: "12px",
  borderRadius: "m",
  border: "1px solid token(colors.border)",
  backgroundColor: "surface",
  cursor: "pointer",
  textAlign: "left",
  fontFamily: "sans",
  color: "text",
  transition: "all token(durations.fast) token(easings.apple)",
  _hover: { borderColor: "accent" },
})

const themeCardActive = css({
  borderColor: "accent",
  boxShadow: "0 0 0 2px token(colors.accentGlow)",
})

const themePreview = css({
  display: "flex",
  alignItems: "center",
  gap: "6px",
  borderRadius: "s",
  padding: "10px",
})

const themeSwatch = css({ width: "14px", height: "14px", borderRadius: "full", flexShrink: 0 })

const themeLabelRow = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontSize: "14px",
  fontWeight: "600",
})

const themeDescription = css({ fontSize: "12px", color: "textSecondary" })

const settingsCard = css({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  maxWidth: "480px",
  padding: "20px",
  borderRadius: "m",
  border: "1px solid token(colors.border)",
  backgroundColor: "surface",
})

const toggleRow = css({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "16px",
  cursor: "pointer",
})

const toggleLabel = css({ fontSize: "15px", fontWeight: "600" })
const toggleHint = css({ fontSize: "12px", color: "textSecondary", marginTop: "2px" })

const durationRow = css({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  paddingTop: "16px",
  borderTop: "1px solid token(colors.border)",
})

const durationHeader = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontSize: "14px",
  fontWeight: "600",
})

const durationValue = css({
  fontSize: "13px",
  color: "accent",
  fontVariantNumeric: "tabular-nums",
})

const slider = css({
  width: "100%",
  appearance: "none",
  height: "4px",
  borderRadius: "full",
  backgroundColor: "overlayIntense",
  cursor: "pointer",
  "&::-webkit-slider-thumb": {
    appearance: "none",
    width: "16px",
    height: "16px",
    borderRadius: "full",
    backgroundColor: "accent",
    transition: "transform token(durations.fast) token(easings.apple)",
  },
  "&:hover::-webkit-slider-thumb": { transform: "scale(1.2)" },
  _disabled: { opacity: 0.4, cursor: "not-allowed" },
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
  const { theme, setTheme } = useTheme()
  const crossfadeEnabled = useAudioSettingsStore((s) => s.crossfadeEnabled)
  const crossfadeDuration = useAudioSettingsStore((s) => s.crossfadeDuration)
  const setCrossfadeEnabled = useAudioSettingsStore((s) => s.setCrossfadeEnabled)
  const setCrossfadeDuration = useAudioSettingsStore((s) => s.setCrossfadeDuration)

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

      <h2 className={sectionTitle}>Thème</h2>
      <div className={themeGrid}>
        {themes.map((t) => (
          <button
            key={t.id}
            type="button"
            className={cx(themeCard, theme === t.id && themeCardActive)}
            onClick={() => setTheme(t.id)}
            aria-pressed={theme === t.id}
          >
            <div className={themePreview} style={{ backgroundColor: t.preview.bg }}>
              <span className={themeSwatch} style={{ backgroundColor: t.preview.surface }} />
              <span className={themeSwatch} style={{ backgroundColor: t.preview.accent }} />
            </div>
            <div className={themeLabelRow}>
              {t.label}
              {theme === t.id && <CheckIcon size={16} />}
            </div>
            <div className={themeDescription}>{t.description}</div>
          </button>
        ))}
      </div>

      <h2 className={sectionTitle}>Lecture</h2>
      <div className={settingsCard}>
        <label className={toggleRow}>
          <span>
            <span className={toggleLabel}>Fondu enchaîné</span>
            <span className={toggleHint}>
              Transition « DJ » : le titre suivant démarre avant la fin du précédent, en fondu.
            </span>
          </span>
          <input
            type="checkbox"
            checked={crossfadeEnabled}
            onChange={(event) => setCrossfadeEnabled(event.target.checked)}
          />
        </label>

        {crossfadeEnabled && (
          <div className={durationRow}>
            <div className={durationHeader}>
              <span>Durée du fondu</span>
              <span className={durationValue}>{crossfadeDuration} s</span>
            </div>
            <input
              type="range"
              className={slider}
              min={CROSSFADE_MIN}
              max={CROSSFADE_MAX}
              step={1}
              value={crossfadeDuration}
              onChange={(event) => setCrossfadeDuration(Number(event.target.value))}
            />
          </div>
        )}
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
