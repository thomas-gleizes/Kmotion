import { css } from "styled-system/css"

export const pageHeading = css({
  fontSize: "26px",
  fontWeight: "800",
  letterSpacing: "-0.8px",
  marginBottom: "20px",
  md: { fontSize: "32px", marginBottom: "24px" },
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
