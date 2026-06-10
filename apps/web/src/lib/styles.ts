import { css } from "styled-system/css"

export const pageHeading = css({
  fontSize: "32px",
  fontWeight: "800",
  letterSpacing: "-0.8px",
  marginBottom: "24px",
})

export const truncate = css({
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
})

export const emptyState = css({
  color: "textSecondary",
  textAlign: "center",
  padding: "60px 0",
  fontSize: "15px",
})
