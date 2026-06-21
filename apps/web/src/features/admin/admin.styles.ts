import { css, cx } from "styled-system/css"
import { truncate } from "@/shared/lib/styles"

export const tabs = css({
  display: "flex",
  gap: "8px",
  marginBottom: "24px",
  borderBottom: "1px solid token(colors.border)",
})

export const tab = css({
  padding: "10px 4px",
  marginBottom: "-1px",
  background: "none",
  border: "none",
  borderBottom: "2px solid transparent",
  color: "textSecondary",
  fontSize: "15px",
  fontWeight: "600",
  fontFamily: "sans",
  cursor: "pointer",
  transition: "all token(durations.fast) token(easings.apple)",
  _hover: { color: "text" },
})

export const tabActive = css({ color: "text", borderBottomColor: "accent" })

export const sectionHeader = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
  marginBottom: "16px",
})

export const sectionTitle = css({ fontSize: "14px", color: "textSecondary" })

export const row = css({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "8px 16px",
  padding: "10px 12px",
  md: { flexWrap: "nowrap", gap: "16px" },
  borderRadius: "s",
  transition: "background token(durations.fast) token(easings.apple)",
  _hover: { backgroundColor: "overlay" },
})

export const cellMain = css({ flex: 1, minWidth: 0 })
export const rowTitle = cx(truncate, css({ fontSize: "15px", fontWeight: "600" }))
export const rowSub = cx(truncate, css({ fontSize: "13px", color: "textSecondary" }))
export const rowMeta = cx(truncate, css({ fontSize: "12px", color: "textTertiary" }))
export const rowDuration = css({
  display: "none",
  fontSize: "13px",
  color: "textTertiary",
  fontVariantNumeric: "tabular-nums",
  flexShrink: 0,
  md: { display: "block" },
})

const badge = css({
  display: "inline-block",
  marginLeft: "8px",
  padding: "1px 7px",
  borderRadius: "full",
  fontSize: "10px",
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  verticalAlign: "middle",
})
export const adminBadge = cx(
  badge,
  css({ backgroundColor: "rgba(94, 92, 230, 0.22)", color: "#b7b6ff" }),
)
export const bannedBadge = cx(badge, css({ backgroundColor: "dangerSoft", color: "danger" }))

export const actions = css({ display: "flex", gap: "8px", flexShrink: 0 })

const iconButton = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "32px",
  height: "32px",
  _touch: { width: "40px", height: "40px" },
  borderRadius: "full",
  border: "none",
  background: "none",
  color: "textSecondary",
  cursor: "pointer",
  flexShrink: 0,
  transition: "all token(durations.fast) token(easings.apple)",
  _hover: { color: "accent", backgroundColor: "accentSoft" },
})
export { iconButton }

export const dangerIconButton = cx(
  iconButton,
  css({ _hover: { color: "danger !important", backgroundColor: "dangerSoft" } }),
)

export const pager = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "16px",
  marginTop: "28px",
  color: "textSecondary",
  fontSize: "14px",
})

export const searchBox = css({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "12px 18px",
  borderRadius: "m",
  backgroundColor: "surfaceRaised",
  border: "1px solid token(colors.border)",
  marginBottom: "16px",
  color: "textSecondary",
  transition: "all token(durations.fast) token(easings.apple)",
  _focusWithin: { borderColor: "accent", boxShadow: "0 0 0 3px token(colors.accentGlow)" },
})

export const searchInput = css({
  flex: 1,
  background: "none",
  border: "none",
  outline: "none",
  color: "text",
  fontSize: "16px",
  fontFamily: "sans",
  _placeholder: { color: "textTertiary" },
})

export const syncFeedback = css({ fontSize: "13px", marginTop: "10px" })
export const syncOk = css({ color: "accent" })
export const syncError = css({ color: "danger" })
