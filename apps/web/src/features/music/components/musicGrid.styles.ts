import { css } from "styled-system/css"
import type { GridLayout } from "@/features/music/hooks/useGridLayout"

const compactGrid = css.raw({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
  gap: "10px",
  md: { gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: "12px" },
})

// Moins de colonnes, donc des pochettes plus grandes.
const largeGrid = css.raw({
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  md: { gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" },
})

export const musicGrid = (layout: GridLayout) => css(compactGrid, layout === "large" && largeGrid)
