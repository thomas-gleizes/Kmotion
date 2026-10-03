import { css } from "styled-system/css"
import type { MusicSort, SortOrder } from "@/features/music/api/music.queries"
import { ChevronDownIcon, ChevronUpIcon, ShuffleIcon } from "@/shared/ui/icons"

const SORT_LABELS: Record<MusicSort, string> = {
  createdAt: "Date d’ajout",
  title: "Titre",
  artist: "Artiste",
  duration: "Durée",
  favorite: "Favoris",
  random: "Aléatoire",
}

const controls = css({
  display: "flex",
  alignItems: "center",
  gap: "8px",
})

const select = css({
  appearance: "none",
  padding: "8px 14px",
  borderRadius: "m",
  backgroundColor: "surfaceRaised",
  border: "1px solid token(colors.border)",
  color: "text",
  fontSize: "14px",
  fontFamily: "sans",
  cursor: "pointer",
  outline: "none",
  transition: "all token(durations.fast) token(easings.apple)",
  _focusVisible: { borderColor: "accent", boxShadow: "0 0 0 3px token(colors.accentGlow)" },
})

const directionButton = css({
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

type SortControlsProps = {
  /** Tris proposés, dans l'ordre d'affichage. */
  options: MusicSort[]
  sort: MusicSort
  order: SortOrder
  onSortChange: (sort: MusicSort) => void
  onToggleOrder: () => void
  /** Tri aléatoire : le bouton d'ordre devient « Mélanger à nouveau ». */
  onShuffle?: () => void
}

/** Sélecteur de tri + bouton d'ordre (ou de mélange en tri aléatoire). */
export function SortControls({
  options,
  sort,
  order,
  onSortChange,
  onToggleOrder,
  onShuffle,
}: SortControlsProps) {
  return (
    <div className={controls}>
      <select
        className={select}
        value={sort}
        onChange={(e) => onSortChange(e.target.value as MusicSort)}
        aria-label="Trier par"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {SORT_LABELS[option]}
          </option>
        ))}
      </select>
      {sort === "random" && onShuffle ? (
        <button
          type="button"
          className={directionButton}
          onClick={onShuffle}
          aria-label="Mélanger à nouveau"
          title="Mélanger à nouveau"
        >
          <ShuffleIcon size={18} />
        </button>
      ) : (
        <button
          type="button"
          className={directionButton}
          onClick={onToggleOrder}
          aria-label={order === "asc" ? "Ordre croissant" : "Ordre décroissant"}
          title={order === "asc" ? "Ordre croissant" : "Ordre décroissant"}
        >
          {order === "asc" ? <ChevronUpIcon size={18} /> : <ChevronDownIcon size={18} />}
        </button>
      )}
    </div>
  )
}
