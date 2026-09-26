import type { Clip } from "./api"
import { formatDuration, parseDuration } from "./format"

/** Clip bounds as typed by the user ("m:ss"). */
export type ClipInput = { start: string; end: string }

export type ResolvedClip =
  | { ok: true; start: number; end: number; duration: number; clip: Clip | undefined }
  | { ok: false; error: string }

/** Bounds covering the whole video, i.e. no cut. */
export function fullClipInput(total: number): ClipInput {
  return { start: formatDuration(0), end: formatDuration(total) }
}

/**
 * Validates the typed bounds against the video duration. `clip` is what to send
 * to the server: only the bounds that actually cut something, `undefined` for
 * the whole video.
 */
export function resolveClipInput(input: ClipInput, total: number): ResolvedClip {
  // Durations are shown to the second: compare on whole seconds.
  const length = Math.floor(total)
  const start = parseDuration(input.start)
  const end = parseDuration(input.end)

  if (start === null) return { ok: false, error: "Début invalide (format m:ss)" }
  if (end === null) return { ok: false, error: "Fin invalide (format m:ss)" }
  if (end > length) {
    return { ok: false, error: `La fin dépasse la durée de la vidéo (${formatDuration(length)})` }
  }
  if (end <= start) return { ok: false, error: "Le début doit être avant la fin" }

  const cutStart = start > 0
  const cutEnd = end < length
  const clip =
    cutStart || cutEnd ? { ...(cutStart && { start }), ...(cutEnd && { end }) } : undefined

  return { ok: true, start, end, duration: end - start, clip }
}
