import { css, cx } from "styled-system/css"
import { truncate } from "@/shared/lib/styles"

export const bar = css({
  gridArea: "player",
  display: "grid",
  gridTemplateColumns: "minmax(200px, 1fr) auto minmax(200px, 1fr)",
  alignItems: "center",
  gap: "16px",
  padding: "10px 20px",
  backgroundColor: "surfaceTranslucent",
  backdropFilter: "blur(20px) saturate(180%)",
  borderTop: "1px solid token(colors.border)",
  boxShadow: "bar",
  animation: "fadeIn token(durations.normal) token(easings.apple)",
})

export const cover = css({
  width: "48px",
  height: "48px",
  borderRadius: "s",
  overflow: "hidden",
  flexShrink: 0,
  boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
})

export const expandTrigger = css({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  minWidth: 0,
  background: "none",
  border: "none",
  color: "text",
  cursor: "pointer",
  padding: "4px 8px 4px 0",
  borderRadius: "s",
  textAlign: "left",
  transition: "opacity token(durations.fast) token(easings.apple)",
  _hover: { opacity: 0.8 },
})

export const titleStyle = cx(truncate, css({ fontSize: "14px", fontWeight: "600" }))

export const artistStyle = cx(truncate, css({ fontSize: "12px", color: "textSecondary" }))

export const controls = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "4px",
})

export const buttons = css({
  display: "flex",
  alignItems: "center",
  gap: "18px",
})

export const controlButton = css({
  background: "none",
  border: "none",
  color: "text",
  cursor: "pointer",
  display: "flex",
  padding: "4px",
  borderRadius: "full",
  transition: "all token(durations.fast) token(easings.apple)",
  _hover: { color: "accent", transform: "scale(1.08)" },
  _disabled: { color: "textTertiary", transform: "none", cursor: "default" },
})

export const playButton = css({
  background: "white",
  color: "black !important",
  width: "38px",
  height: "38px",
  alignItems: "center",
  justifyContent: "center",
  _hover: { transform: "scale(1.06)", color: "black" },
})

export const toggleActive = css({
  color: "accent !important",
  _hover: { color: "accentHover !important" },
})

export const repeatWrap = css({ position: "relative" })

export const repeatBadge = css({
  position: "absolute",
  top: "0",
  right: "0",
  minWidth: "12px",
  height: "12px",
  padding: "0 2px",
  borderRadius: "full",
  backgroundColor: "accent",
  color: "white",
  fontSize: "8px",
  fontWeight: "700",
  lineHeight: "12px",
  textAlign: "center",
})

export const progressRow = css({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  width: "min(440px, 40vw)",
  fontSize: "11px",
  color: "textSecondary",
  fontVariantNumeric: "tabular-nums",
})

export const slider = css({
  flex: 1,
  appearance: "none",
  height: "4px",
  borderRadius: "full",
  backgroundColor: "overlayIntense",
  cursor: "pointer",
  "&::-webkit-slider-thumb": {
    appearance: "none",
    width: "12px",
    height: "12px",
    borderRadius: "full",
    backgroundColor: "text",
    transition: "transform token(durations.fast) token(easings.apple)",
  },
  "&:hover::-webkit-slider-thumb": { transform: "scale(1.25)" },
})

export const volumeArea = css({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  justifySelf: "end",
  color: "textSecondary",
})

export const miniBar = css({
  gridArea: "player",
  position: "relative",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "8px 12px",
  backgroundColor: "surfaceTranslucent",
  backdropFilter: "blur(20px) saturate(180%)",
  borderTop: "1px solid token(colors.border)",
  boxShadow: "bar",
  animation: "fadeIn token(durations.normal) token(easings.apple)",
})

export const miniProgressTrack = css({
  position: "absolute",
  top: "-1px",
  left: 0,
  right: 0,
  height: "2px",
  backgroundColor: "overlayStrong",
})

export const miniProgressFill = css({
  height: "100%",
  backgroundColor: "accent",
})

export const miniExpand = css({
  flex: 1,
  display: "flex",
  alignItems: "center",
  gap: "12px",
  minWidth: 0,
  background: "none",
  border: "none",
  color: "text",
  cursor: "pointer",
  padding: 0,
  textAlign: "left",
})

export const miniCover = css({
  width: "40px",
  height: "40px",
  borderRadius: "s",
  overflow: "hidden",
  flexShrink: 0,
})

export const miniPlayButton = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "44px",
  height: "44px",
  borderRadius: "full",
  border: "none",
  background: "none",
  color: "text",
  cursor: "pointer",
  flexShrink: 0,
})
