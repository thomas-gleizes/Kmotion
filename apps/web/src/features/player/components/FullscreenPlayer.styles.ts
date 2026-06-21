import { css, cx } from "styled-system/css"
import { truncate } from "@/shared/lib/styles"

export const overlay = css({
  position: "fixed",
  inset: 0,
  zIndex: 100,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  background: "linear-gradient(160deg, #0f0a0b 0%, #0a0a0c 55%, #080810 100%)",
  _light: {
    background: "linear-gradient(160deg, #fafafc 0%, #f5f5f7 55%, #efeff2 100%)",
  },
})

export const overlayEntering = css({ animation: "slideUp 0.35s token(easings.apple)" })

export const overlayExiting = css({ animation: "slideDown 0.28s token(easings.apple) both" })

// Calque ambiant : la pochette floutée et saturée colore le fond avec les
// teintes du morceau en cours (à la Apple Music / Spotify).
export const ambientBg = css({
  position: "absolute",
  inset: "-10%",
  zIndex: 0,
  backgroundSize: "cover",
  backgroundPosition: "center",
  filter: "blur(72px) saturate(1.7)",
  transform: "scale(1.25)",
  opacity: 0.55,
  animation: "ambientIn 0.8s token(easings.apple) both",
  pointerEvents: "none",
})

// Voile dégradé pour garder titres, contrôles et file de lecture lisibles.
// Sur mobile (layout vertical), le dégradé part du haut pour laisser la
// couleur ambiante apparaître derrière la pochette, comme sur desktop.
export const scrim = css({
  position: "absolute",
  inset: 0,
  zIndex: 0,
  background:
    "radial-gradient(140% 60% at 50% 0%, rgba(10,10,12,0.3) 0%, rgba(10,10,12,0.75) 55%, rgba(8,8,16,0.92) 100%)",
  pointerEvents: "none",
  md: {
    background:
      "radial-gradient(120% 90% at 30% 0%, rgba(10,10,12,0.35) 0%, rgba(10,10,12,0.72) 60%, rgba(8,8,16,0.9) 100%)",
  },
  _light: {
    background:
      "radial-gradient(140% 60% at 50% 0%, rgba(245,245,247,0.4) 0%, rgba(245,245,247,0.82) 55%, rgba(239,239,242,0.95) 100%)",
    md: {
      background:
        "radial-gradient(120% 90% at 30% 0%, rgba(245,245,247,0.45) 0%, rgba(245,245,247,0.8) 60%, rgba(239,239,242,0.94) 100%)",
    },
  },
})

// Poignée de glissement (mobile) : zone tactile en haut pour fermer le lecteur
// d'un swipe vers le bas. Masquée sur desktop (souris/clavier).
export const grabberZone = css({
  position: "relative",
  zIndex: 2,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  paddingTop: "calc(8px + env(safe-area-inset-top))",
  paddingBottom: "4px",
  flexShrink: 0,
  touchAction: "none",
  md: { display: "none" },
})

export const grabber = css({
  width: "38px",
  height: "5px",
  borderRadius: "full",
  backgroundColor: "rgba(255,255,255,0.35)",
  _light: { backgroundColor: "rgba(0,0,0,0.25)" },
})

export const header = css({
  position: "relative",
  zIndex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "14px 24px",
  flexShrink: 0,
  touchAction: "none",
})

export const closeBtn = css({
  background: "none",
  border: "none",
  color: "textSecondary",
  cursor: "pointer",
  display: "flex",
  padding: "8px",
  borderRadius: "full",
  transition: "all token(durations.fast) token(easings.apple)",
  _hover: { color: "text", backgroundColor: "overlayStrong" },
})

export const nowPlayingLabel = css({
  fontSize: "11px",
  fontWeight: "600",
  letterSpacing: "1.5px",
  textTransform: "uppercase",
  color: "textTertiary",
})

export const body = css({
  position: "relative",
  zIndex: 1,
  display: "flex",
  flex: 1,
  flexDirection: "column",
  gap: "20px",
  padding: "8px 20px calc(24px + env(safe-area-inset-bottom))",
  minHeight: 0,
  md: { flexDirection: "row", gap: "40px", padding: "8px 48px 40px" },
})

export const artSection = css({
  flex: "0 0 auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 0,
  minWidth: 0,
  md: { flex: 1 },
})

export const artBase = css({
  width: "100%",
  aspectRatio: "16/9",
  maxHeight: "38dvh",
  md: { width: "auto", height: "60vh", maxWidth: "100%", maxHeight: "none" },
  borderRadius: "m",
  overflow: "hidden",
  transformOrigin: "center",
  transform: "scale(1)",
  boxShadow: "0 24px 64px rgba(0,0,0,0.55)",
  transition: "transform 0.4s token(easings.apple), box-shadow 0.4s token(easings.apple)",
})

// En pause, la pochette se réduit légèrement (à la Apple Music / Spotify).
export const artPaused = css({
  transform: "scale(0.9)",
  boxShadow: "0 14px 36px rgba(0,0,0,0.45)",
})

export const infoSection = css({
  flex: 1,
  width: "100%",
  maxWidth: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  overflowY: "auto",
  minWidth: 0,
  paddingRight: "4px",
  md: { flex: "0 0 30%", maxWidth: "30%", width: "auto" },
})

export const trackTitle = cx(
  truncate,
  css({
    fontSize: "22px",
    fontWeight: "800",
    letterSpacing: "-0.5px",
    lineHeight: "1.2",
    color: "text",
    md: { fontSize: "28px" },
  }),
)

export const trackArtist = cx(
  truncate,
  css({ fontSize: "17px", color: "textSecondary", fontWeight: "500" }),
)

export const progressBlock = css({ display: "flex", flexDirection: "column", gap: "6px" })

export const progressSlider = css({
  width: "100%",
  appearance: "none",
  height: "4px",
  borderRadius: "full",
  backgroundColor: "rgba(255,255,255,0.16)",
  cursor: "pointer",
  "&::-webkit-slider-thumb": {
    appearance: "none",
    width: "14px",
    height: "14px",
    borderRadius: "full",
    backgroundColor: "text",
    transition: "transform token(durations.fast) token(easings.apple)",
  },
  "&:hover::-webkit-slider-thumb": { transform: "scale(1.3)" },
})

export const timesRow = css({
  display: "flex",
  justifyContent: "space-between",
  fontSize: "12px",
  color: "textTertiary",
  fontVariantNumeric: "tabular-nums",
})

export const controlsRow = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  gap: "20px",
})

export const ctrlBtn = css({
  background: "none",
  border: "none",
  color: "text",
  cursor: "pointer",
  display: "flex",
  padding: "8px",
  borderRadius: "full",
  transition: "all token(durations.fast) token(easings.apple)",
  _hover: { color: "accent", transform: "scale(1.1)" },
  _disabled: { color: "textTertiary", transform: "none", cursor: "default" },
})

export const playBtnExtra = css({
  background: "white",
  color: "black !important",
  width: "52px",
  height: "52px",
  alignItems: "center",
  justifyContent: "center",
  _hover: { transform: "scale(1.06) !important" },
})

export const toggleActive = css({
  color: "accent !important",
  _hover: { color: "accentHover !important", transform: "none" },
})

export const repeatWrap = css({ position: "relative" })

export const repeatBadge = css({
  position: "absolute",
  top: "2px",
  right: "2px",
  minWidth: "13px",
  height: "13px",
  padding: "0 2px",
  borderRadius: "full",
  backgroundColor: "accent",
  color: "white",
  fontSize: "9px",
  fontWeight: "700",
  lineHeight: "13px",
  textAlign: "center",
})

// Masqué sur mobile : le volume se règle avec les boutons physiques.
export const volumeRow = css({
  display: "none",
  md: { display: "flex" },
  alignItems: "center",
  gap: "10px",
  width: "100%",
  color: "textSecondary",
})

export const volumeSlider = css({
  flex: 1,
  appearance: "none",
  height: "3px",
  borderRadius: "full",
  backgroundColor: "rgba(255,255,255,0.16)",
  cursor: "pointer",
  "&::-webkit-slider-thumb": {
    appearance: "none",
    width: "12px",
    height: "12px",
    borderRadius: "full",
    backgroundColor: "text",
  },
})

export const queueSection = css({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  flex: 1,
  minHeight: 0,
})

export const queueLabel = css({
  fontSize: "11px",
  fontWeight: "600",
  letterSpacing: "1.2px",
  textTransform: "uppercase",
  color: "textTertiary",
  paddingBottom: "8px",
  borderBottom: "1px solid token(colors.border)",
})

export const queueList = css({
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "2px",
})

export const queueItem = css({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "8px 10px",
  borderRadius: "s",
  cursor: "pointer",
  background: "none",
  border: "none",
  color: "textSecondary",
  textAlign: "left",
  width: "100%",
  transition:
    "background token(durations.fast) token(easings.apple), color token(durations.fast) token(easings.apple)",
  _hover: { backgroundColor: "overlay", color: "text" },
})

export const queueItemActive = css({ color: "accent !important" })

export const queueIdx = css({
  fontSize: "12px",
  color: "textTertiary",
  width: "20px",
  textAlign: "center",
  flexShrink: 0,
  fontVariantNumeric: "tabular-nums",
})

export const queueTrackTitle = cx(truncate, css({ fontSize: "14px", fontWeight: "500" }))
export const queueTrackArtist = cx(truncate, css({ fontSize: "12px", color: "textSecondary" }))

export const queueDur = css({
  fontSize: "12px",
  color: "textTertiary",
  flexShrink: 0,
  marginLeft: "auto",
  fontVariantNumeric: "tabular-nums",
})
