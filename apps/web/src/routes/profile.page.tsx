import { createRoute, Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { css, cx } from "styled-system/css"
import { appLayoutRoute } from "./app.layout"
import { meQuery } from "../api/queries"
import { logout } from "../auth/auth"
import { Button } from "../components/Button"
import { CheckIcon, DownloadIcon, PersonIcon, PlusIcon, ShieldIcon } from "../components/icons"
import { pageHeading } from "../lib/styles"
import {
  EQ_MAX_DB,
  EQ_MIN_DB,
  useEqualizerStore,
  type EqualizerBand,
} from "../player/equalizerStore"
import { useTheme } from "../theme/ThemeContext"
import { themes } from "../theme/themes"

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

const extensionCard = css({
  maxWidth: "480px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  padding: "20px 24px",
  borderRadius: "l",
  backgroundColor: "surface",
  border: "1px solid token(colors.border)",
})

const extensionText = css({ fontSize: "14px", color: "textSecondary", lineHeight: "1.5" })

const downloadButton = css({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  alignSelf: "flex-start",
  padding: "10px 20px",
  borderRadius: "full",
  fontSize: "15px",
  fontWeight: "600",
  backgroundColor: "accent",
  color: "white",
  cursor: "pointer",
  transition: "all token(durations.fast) token(easings.apple)",
  _hover: { backgroundColor: "accentHover" },
  _active: { transform: "scale(0.97)" },
  _touch: { minHeight: "44px" },
})

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

const equalizerCard = css({
  maxWidth: "480px",
  display: "flex",
  flexDirection: "column",
  gap: "18px",
  padding: "20px 24px",
  borderRadius: "l",
  backgroundColor: "surface",
  border: "1px solid token(colors.border)",
})

const eqRow = css({ display: "flex", flexDirection: "column", gap: "8px" })

const eqLabelRow = css({
  display: "flex",
  justifyContent: "space-between",
  fontSize: "14px",
  fontWeight: "600",
})

const eqValue = css({ color: "textSecondary", fontVariantNumeric: "tabular-nums" })

const eqSlider = css({
  width: "100%",
  appearance: "none",
  height: "4px",
  borderRadius: "full",
  backgroundColor: "surfaceRaised",
  cursor: "pointer",
  "&::-webkit-slider-thumb": {
    appearance: "none",
    width: "16px",
    height: "16px",
    borderRadius: "full",
    backgroundColor: "accent",
    cursor: "pointer",
    transition: "transform token(durations.fast) token(easings.apple)",
  },
  "&:hover::-webkit-slider-thumb": { transform: "scale(1.2)" },
  "&::-moz-range-thumb": {
    width: "16px",
    height: "16px",
    border: "none",
    borderRadius: "full",
    backgroundColor: "accent",
    cursor: "pointer",
  },
})

const eqReset = css({ alignSelf: "flex-start" })

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

const eqBands: { id: EqualizerBand; label: string }[] = [
  { id: "bass", label: "Basses" },
  { id: "mid", label: "Médiums" },
  { id: "treble", label: "Aigus" },
]

const ProfilePage = () => {
  const { data: user, isPending } = useQuery(meQuery)
  const { theme, setTheme } = useTheme()
  const eqSettings = useEqualizerStore((s) => s.settings)
  const setEqBand = useEqualizerStore((s) => s.setBand)
  const resetEq = useEqualizerStore((s) => s.reset)

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
      <div className={extensionCard}>
        <p className={extensionText}>
          Installez l’extension kMotion pour convertir et enregistrer des vidéos YouTube en MP3
          directement depuis votre navigateur. Téléchargez l’archive puis chargez-la dans la page
          des extensions de votre navigateur.
        </p>
        <a className={downloadButton} href="/downloads/kmotion-extension.zip" download>
          <DownloadIcon size={18} /> Télécharger l’extension
        </a>
      </div>

      <h2 className={sectionTitle}>Égaliseur</h2>
      <div className={equalizerCard}>
        {eqBands.map((band) => (
          <div key={band.id} className={eqRow}>
            <div className={eqLabelRow}>
              <span>{band.label}</span>
              <span className={eqValue}>
                {eqSettings[band.id] > 0 ? "+" : ""}
                {eqSettings[band.id]} dB
              </span>
            </div>
            <input
              type="range"
              className={eqSlider}
              min={EQ_MIN_DB}
              max={EQ_MAX_DB}
              step={1}
              value={eqSettings[band.id]}
              onChange={(e) => setEqBand(band.id, Number(e.target.value))}
            />
          </div>
        ))}
        <Button variant="ghost" className={eqReset} onClick={resetEq}>
          Réinitialiser
        </Button>
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
