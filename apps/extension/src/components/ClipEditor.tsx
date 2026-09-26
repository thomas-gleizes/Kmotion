import React, { useState } from "react"
import { FiClock, FiRotateCcw, FiScissors } from "react-icons/fi"
import { formatDuration } from "../utils/format"
import { fullClipInput, type ClipInput, type ResolvedClip } from "../utils/clip"
import { getCurrentVideoTime } from "../utils/player"

const inputClass =
  "w-full px-3 py-1.5 rounded-s bg-surface border border-hairline text-ink text-sm tabular-nums placeholder:text-ink-tertiary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/40 transition"

const iconButtonClass =
  "flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-s bg-surface border border-hairline text-ink-secondary hover:text-ink hover:border-accent/60 transition"

/**
 * Start/end inputs to keep only part of the video (e.g. drop a silent outro).
 * The ⏱ buttons fill a bound with the current YouTube playback position.
 */
export const ClipEditor: React.FC<{
  total: number
  value: ClipInput
  resolved: ResolvedClip
  onChange: (value: ClipInput) => void
}> = ({ total, value, resolved, onChange }) => {
  const [timeUnavailable, setTimeUnavailable] = useState(false)

  const fillWithCurrentTime = async (bound: keyof ClipInput) => {
    const time = await getCurrentVideoTime()
    if (time === null) {
      setTimeUnavailable(true)
      return
    }
    setTimeUnavailable(false)
    onChange({ ...value, [bound]: formatDuration(Math.min(time, total)) })
  }

  const isFull = resolved.ok && !resolved.clip

  const row = (bound: keyof ClipInput, label: string) => (
    <label className="flex items-center gap-2">
      <span className="w-10 text-xs text-ink-secondary">{label}</span>
      <input
        type="text"
        inputMode="numeric"
        placeholder="m:ss"
        value={value[bound]}
        onChange={(e) => onChange({ ...value, [bound]: e.target.value })}
        className={inputClass}
      />
      <button
        type="button"
        title="Utiliser la position actuelle de la vidéo"
        aria-label={`${label} : position actuelle de la vidéo`}
        onClick={() => fillWithCurrentTime(bound)}
        className={iconButtonClass}
      >
        <FiClock size={14} />
      </button>
    </label>
  )

  return (
    <div className="rounded-m bg-surface-raised border border-hairline p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-ink">
          <FiScissors size={12} />
          Découpage
        </span>
        {!isFull && (
          <button
            type="button"
            onClick={() => onChange(fullClipInput(total))}
            className="flex items-center gap-1 text-xs text-ink-secondary hover:text-ink transition"
          >
            <FiRotateCcw size={11} />
            Réinitialiser
          </button>
        )}
      </div>

      {row("start", "Début")}
      {row("end", "Fin")}

      {resolved.ok ? (
        <p className="text-xs text-ink-secondary">
          Durée finale :{" "}
          <span className="text-ink font-medium tabular-nums">
            {formatDuration(resolved.duration)}
          </span>
          {!isFull && ` (sur ${formatDuration(total)})`}
        </p>
      ) : (
        <p className="text-xs text-danger">{resolved.error}</p>
      )}

      {timeUnavailable && (
        <p className="text-xs text-ink-tertiary">
          Position indisponible : rechargez la page YouTube puis réessayez.
        </p>
      )}
    </div>
  )
}
