export function formatRelativeTime(date: string | null): string {
  if (!date) return "Jamais"

  const diffSeconds = Math.round((Date.now() - new Date(date).getTime()) / 1000)

  if (diffSeconds < 60) return "à l'instant"

  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
  ]

  const formatter = new Intl.RelativeTimeFormat("fr", { numeric: "auto" })
  for (const [unit, secondsInUnit] of units) {
    const value = Math.floor(diffSeconds / secondsInUnit)
    if (value >= 1) return formatter.format(-value, unit)
  }

  return "à l'instant"
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.round(totalSeconds))
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return `${minutes}:${rest.toString().padStart(2, "0")}`
}

export function extractMediaId(input: string): string | null {
  const trimmed = input.trim()
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed
  try {
    const url = new URL(trimmed)
    const fromParam = url.searchParams.get("v")
    if (fromParam && /^[a-zA-Z0-9_-]{11}$/.test(fromParam)) return fromParam
    const match = url.pathname.match(/(?:\/shorts\/|\/embed\/|^\/)([a-zA-Z0-9_-]{11})(?:\/|$)/)
    if (match) return match[1]
  } catch {
    return null
  }
  return null
}
