import { createRoute, Link, redirect } from "@tanstack/react-router"
import { css } from "styled-system/css"
import { rootRoute } from "../router"
import { isAuthenticated } from "../auth/auth"
import { ListIcon, MusicNoteIcon, PlayIcon, SearchIcon } from "../components/icons"

const page = css({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  background:
    "radial-gradient(1200px 800px at 70% -10%, token(colors.accentGlow), transparent 60%), radial-gradient(900px 600px at 10% 110%, rgba(94, 92, 230, 0.16), transparent 60%), token(colors.bg)",
})

const nav = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "22px clamp(20px, 6vw, 64px)",
})

const brand = css({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  color: "accent",
  fontSize: "22px",
  fontWeight: "800",
  letterSpacing: "-0.5px",
})

const navLogin = css({
  fontSize: "14px",
  fontWeight: "600",
  color: "textSecondary",
  transition: "color token(durations.fast) token(easings.apple)",
  _hover: { color: "text" },
})

const hero = css({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  padding: "40px clamp(20px, 6vw, 64px) 64px",
  gap: "24px",
})

const eyebrow = css({
  fontSize: "12px",
  fontWeight: "700",
  letterSpacing: "2px",
  textTransform: "uppercase",
  color: "accent",
  animation: "fadeIn token(durations.normal) token(easings.apple)",
})

const headline = css({
  fontSize: "clamp(40px, 7vw, 72px)",
  fontWeight: "800",
  letterSpacing: "-1.5px",
  lineHeight: "1.05",
  maxWidth: "14ch",
  animation: "fadeIn token(durations.normal) token(easings.apple)",
})

const accentWord = css({ color: "accent" })

const subhead = css({
  fontSize: "clamp(16px, 2.2vw, 20px)",
  color: "textSecondary",
  maxWidth: "56ch",
  lineHeight: "1.5",
  animation: "fadeIn token(durations.normal) token(easings.apple)",
})

const ctaRow = css({
  display: "flex",
  flexWrap: "wrap",
  gap: "14px",
  justifyContent: "center",
  marginTop: "8px",
  animation: "scaleIn token(durations.normal) token(easings.apple)",
})

const ctaBase = css({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  padding: "14px 28px",
  borderRadius: "full",
  fontSize: "16px",
  fontWeight: "600",
  transition: "all token(durations.fast) token(easings.apple)",
})

const ctaPrimary = css({
  backgroundColor: "accent",
  color: "white",
  _hover: { backgroundColor: "accentHover", transform: "translateY(-2px)" },
  _active: { transform: "scale(0.97)" },
})

const ctaGhost = css({
  backgroundColor: "surfaceRaised",
  color: "text",
  _hover: { backgroundColor: "overlayIntense", transform: "translateY(-2px)" },
  _active: { transform: "scale(0.97)" },
})

const features = css({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "16px",
  width: "min(900px, 100%)",
  marginTop: "40px",
})

const featureCard = css({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  padding: "24px",
  textAlign: "left",
  borderRadius: "l",
  backgroundColor: "surfaceTranslucent",
  backdropFilter: "blur(20px) saturate(180%)",
  border: "1px solid token(colors.border)",
  transition: "transform token(durations.normal) token(easings.apple)",
  _hover: { transform: "translateY(-4px)" },
})

const featureIcon = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "42px",
  height: "42px",
  borderRadius: "m",
  backgroundColor: "accentSoft",
  color: "accent",
})

const featureTitle = css({ fontSize: "17px", fontWeight: "700" })

const featureText = css({ fontSize: "14px", color: "textSecondary", lineHeight: "1.5" })

const footer = css({
  padding: "24px",
  textAlign: "center",
  fontSize: "13px",
  color: "textTertiary",
})

const FEATURES = [
  {
    icon: <MusicNoteIcon size={22} />,
    title: "Écoute immersive",
    text: "Une bibliothèque fluide et un lecteur plein écran qui se teinte aux couleurs de la pochette.",
  },
  {
    icon: <SearchIcon size={22} />,
    title: "Recherche instantanée",
    text: "Retrouvez n’importe quel titre de votre collection en quelques frappes.",
  },
  {
    icon: <ListIcon size={22} />,
    title: "Playlists à votre main",
    text: "Composez vos playlists avec lecture aléatoire et répétition, comme vos apps préférées.",
  },
] as const

export const LandingPage = () => {
  return (
    <div className={page}>
      <header className={nav}>
        <div className={brand}>
          <MusicNoteIcon size={24} />
          Kmotion
        </div>
        <Link to="/login" className={navLogin}>
          Se connecter
        </Link>
      </header>

      <main className={hero}>
        <span className={eyebrow}>Votre musique, sans limite</span>
        <h1 className={headline}>
          Toute votre musique, <span className={accentWord}>au même endroit</span>.
        </h1>
        <p className={subhead}>
          Convertissez vos vidéos YouTube en MP3, organisez vos playlists et écoutez en streaming —
          le tout dans une interface épurée, où que vous soyez.
        </p>

        <div className={ctaRow}>
          <Link to="/register" className={`${ctaBase} ${ctaPrimary}`}>
            <PlayIcon size={18} /> Commencer gratuitement
          </Link>
          <Link to="/login" className={`${ctaBase} ${ctaGhost}`}>
            J’ai déjà un compte
          </Link>
        </div>

        <div className={features}>
          {FEATURES.map((feature) => (
            <div key={feature.title} className={featureCard}>
              <div className={featureIcon}>{feature.icon}</div>
              <div className={featureTitle}>{feature.title}</div>
              <p className={featureText}>{feature.text}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className={footer}>© {new Date().getFullYear()} Kmotion</footer>
    </div>
  )
}

export const landingRoute = createRoute({
  path: "/welcome",
  component: LandingPage,
  getParentRoute: () => rootRoute,
  beforeLoad: () => {
    if (isAuthenticated()) throw redirect({ to: "/" })
  },
})
