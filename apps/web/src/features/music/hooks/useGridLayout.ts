import { useState } from "react"

export type GridLayout = "compact" | "large"

/** Densité de la grille, mémorisée dans le localStorage. */
export function useGridLayout(storageKey: string): [GridLayout, () => void] {
  const [layout, setLayout] = useState<GridLayout>(() => {
    try {
      if (localStorage.getItem(storageKey) === "large") return "large"
    } catch {
      // ignore
    }
    return "compact"
  })

  const toggleLayout = () => {
    setLayout((prev) => {
      const next = prev === "compact" ? "large" : "compact"
      try {
        localStorage.setItem(storageKey, next)
      } catch {
        // ignore
      }
      return next
    })
  }

  return [layout, toggleLayout]
}
