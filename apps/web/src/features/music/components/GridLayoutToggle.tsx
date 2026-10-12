import { css } from "styled-system/css"
import type { GridLayout } from "@/features/music/hooks/useGridLayout"
import { GridLargeIcon, GridSmallIcon } from "@/shared/ui/icons"

const button = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "36px",
  height: "36px",
  borderRadius: "m",
  backgroundColor: "surfaceRaised",
  border: "1px solid token(colors.border)",
  color: "textSecondary",
  cursor: "pointer",
  transition: "all token(durations.fast) token(easings.apple)",
  _hover: { color: "accent", borderColor: "accent" },
})

type GridLayoutToggleProps = {
  layout: GridLayout
  onToggle: () => void
}

/** Bascule entre la grille compacte et les grandes pochettes (icône du mode cible). */
export function GridLayoutToggle({ layout, onToggle }: GridLayoutToggleProps) {
  const label = layout === "compact" ? "Grandes pochettes" : "Grille compacte"
  return (
    <button type="button" className={button} onClick={onToggle} aria-label={label} title={label}>
      {layout === "compact" ? <GridLargeIcon size={18} /> : <GridSmallIcon size={18} />}
    </button>
  )
}
