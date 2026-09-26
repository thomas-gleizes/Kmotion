export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00"
  const total = Math.floor(seconds)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

/**
 * Parses "ss", "m:ss" or "h:mm:ss" into seconds; `null` when malformed. Only the
 * leading unit may exceed 59, so "75:00" (as `formatDuration` writes it) works.
 */
export function parseDuration(value: string): number | null {
  const parts = value.trim().split(":")
  if (parts.length > 3 || parts.some((part) => !/^\d+$/.test(part))) return null
  const units = parts.map(Number)
  if (units.slice(1).some((unit) => unit >= 60)) return null
  return units.reduce((total, unit) => total * 60 + unit, 0)
}
