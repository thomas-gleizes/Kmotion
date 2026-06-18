import { useState } from "react"
import type { MusicSort, SortOrder } from "../api/queries"

type SortPreference = { sort: MusicSort; order: SortOrder }

export function useSortPreference(
  storageKey: string,
  defaults: SortPreference,
): [SortPreference, (sort: MusicSort) => void, () => void] {
  const [prefs, setPrefs] = useState<SortPreference>(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) return JSON.parse(stored) as SortPreference
    } catch {
      // ignore
    }
    return defaults
  })

  const setSort = (sort: MusicSort) => {
    setPrefs((prev) => {
      const next = { ...prev, sort }
      localStorage.setItem(storageKey, JSON.stringify(next))
      return next
    })
  }

  const toggleOrder = () => {
    setPrefs((prev) => {
      const next = { ...prev, order: prev.order === "asc" ? "desc" : "asc" }
      localStorage.setItem(storageKey, JSON.stringify(next))
      return next
    })
  }

  return [prefs, setSort, toggleOrder]
}
