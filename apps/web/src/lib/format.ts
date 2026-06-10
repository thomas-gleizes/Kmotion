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
