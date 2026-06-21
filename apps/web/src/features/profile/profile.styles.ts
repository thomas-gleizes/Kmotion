import { css } from "styled-system/css"

export const card = css({
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

export const avatar = css({
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

export const nameStyle = css({ fontSize: "22px", fontWeight: "700" })
export const emailStyle = css({ fontSize: "14px", color: "textSecondary" })
export const badge = css({
  fontSize: "12px",
  color: "accent",
  backgroundColor: "accentSoft",
  padding: "3px 10px",
  borderRadius: "full",
  fontWeight: "600",
})

export const sectionTitle = css({ fontSize: "16px", fontWeight: "700", margin: "28px 0 12px" })

export const extensionCard = css({
  maxWidth: "480px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  padding: "20px 24px",
  borderRadius: "l",
  backgroundColor: "surface",
  border: "1px solid token(colors.border)",
})

export const extensionText = css({ fontSize: "14px", color: "textSecondary", lineHeight: "1.5" })

export const downloadButton = css({
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

export const themeGrid = css({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
  gap: "12px",
  maxWidth: "480px",
})

export const themeCard = css({
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

export const themeCardActive = css({
  borderColor: "accent",
  boxShadow: "0 0 0 2px token(colors.accentGlow)",
})

export const themePreview = css({
  display: "flex",
  alignItems: "center",
  gap: "6px",
  borderRadius: "s",
  padding: "10px",
})

export const themeSwatch = css({ width: "14px", height: "14px", borderRadius: "full", flexShrink: 0 })

export const themeLabelRow = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontSize: "14px",
  fontWeight: "600",
})

export const themeDescription = css({ fontSize: "12px", color: "textSecondary" })

export const equalizerCard = css({
  maxWidth: "480px",
  display: "flex",
  flexDirection: "column",
  gap: "18px",
  padding: "20px 24px",
  borderRadius: "l",
  backgroundColor: "surface",
  border: "1px solid token(colors.border)",
})

export const eqRow = css({ display: "flex", flexDirection: "column", gap: "8px" })

export const eqLabelRow = css({
  display: "flex",
  justifyContent: "space-between",
  fontSize: "14px",
  fontWeight: "600",
})

export const eqValue = css({ color: "textSecondary", fontVariantNumeric: "tabular-nums" })

export const eqSlider = css({
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

export const eqReset = css({ alignSelf: "flex-start" })

// Liens absents de la tab bar mobile (présents dans la sidebar desktop).
export const mobileLinks = css({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  maxWidth: "480px",
  marginTop: "16px",
  md: { display: "none" },
})

export const mobileLink = css({
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
