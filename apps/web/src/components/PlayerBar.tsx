import { css, cx } from "styled-system/css"
import { truncate } from "../lib/styles"
import { usePlayer, usePlayerProgress } from "../player/PlayerContext"
import { thumbnailPath } from "../player/audioCache"
import { formatDuration } from "../lib/format"
import { AuthImage } from "./AuthImage"
import { NextIcon, PauseIcon, PlayIcon, PrevIcon, SpinnerIcon, VolumeIcon } from "./icons"

const bar = css({
  gridArea: "player",
  display: "grid",
  gridTemplateColumns: "minmax(200px, 1fr) auto minmax(200px, 1fr)",
  alignItems: "center",
  gap: "16px",
  padding: "10px 20px",
  backgroundColor: "surfaceTranslucent",
  backdropFilter: "blur(20px) saturate(180%)",
  borderTop: "1px solid token(colors.border)",
  boxShadow: "bar",
  animation: "fadeIn token(durations.normal) token(easings.apple)",
})

const cover = css({
  width: "48px",
  height: "48px",
  borderRadius: "s",
  overflow: "hidden",
  flexShrink: 0,
  boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
})

const expandTrigger = css({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  minWidth: 0,
  background: "none",
  border: "none",
  color: "text",
  cursor: "pointer",
  padding: "4px 8px 4px 0",
  borderRadius: "s",
  textAlign: "left",
  transition: "opacity token(durations.fast) token(easings.apple)",
  _hover: { opacity: 0.8 },
})

const titleStyle = cx(truncate, css({ fontSize: "14px", fontWeight: "600" }))

const artistStyle = cx(truncate, css({ fontSize: "12px", color: "textSecondary" }))

const controls = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "4px",
})

const buttons = css({
  display: "flex",
  alignItems: "center",
  gap: "18px",
})

const controlButton = css({
  background: "none",
  border: "none",
  color: "text",
  cursor: "pointer",
  display: "flex",
  padding: "4px",
  borderRadius: "full",
  transition: "all token(durations.fast) token(easings.apple)",
  _hover: { color: "accent", transform: "scale(1.08)" },
  _disabled: { color: "textTertiary", transform: "none", cursor: "default" },
})

const playButton = css({
  background: "white",
  color: "black !important",
  width: "38px",
  height: "38px",
  alignItems: "center",
  justifyContent: "center",
  _hover: { transform: "scale(1.06)", color: "black" },
})

const progressRow = css({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  width: "min(440px, 40vw)",
  fontSize: "11px",
  color: "textSecondary",
  fontVariantNumeric: "tabular-nums",
})

const slider = css({
  flex: 1,
  appearance: "none",
  height: "4px",
  borderRadius: "full",
  backgroundColor: "rgba(255,255,255,0.18)",
  cursor: "pointer",
  "&::-webkit-slider-thumb": {
    appearance: "none",
    width: "12px",
    height: "12px",
    borderRadius: "full",
    backgroundColor: "white",
    transition: "transform token(durations.fast) token(easings.apple)",
  },
  "&:hover::-webkit-slider-thumb": { transform: "scale(1.25)" },
})

const volumeArea = css({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  justifySelf: "end",
  color: "textSecondary",
})

export function PlayerBar({ onExpand }: { onExpand?: () => void }) {
  const player = usePlayer()
  const { currentTime, duration } = usePlayerProgress()

  if (!player.current) return null
  const { current } = player

  return (
    <div className={bar}>
      <button type="button" className={expandTrigger} onClick={onExpand} aria-label="Agrandir le lecteur">
        <div className={cover}>
          <AuthImage path={thumbnailPath(current.id)} alt={current.title} />
        </div>
        <div className={css({ minWidth: 0 })}>
          <div className={titleStyle}>{current.title}</div>
          <div className={artistStyle}>{current.artist}</div>
        </div>
      </button>

      <div className={controls}>
        <div className={buttons}>
          <button
            type="button"
            className={controlButton}
            onClick={player.prev}
            aria-label="Titre précédent"
          >
            <PrevIcon size={20} />
          </button>
          <button
            type="button"
            className={`${controlButton} ${playButton}`}
            onClick={player.toggle}
            aria-label={player.isPlaying ? "Pause" : "Lecture"}
          >
            {player.isLoading ? (
              <SpinnerIcon size={18} />
            ) : player.isPlaying ? (
              <PauseIcon size={18} />
            ) : (
              <PlayIcon size={18} />
            )}
          </button>
          <button
            type="button"
            className={controlButton}
            onClick={player.next}
            disabled={player.index >= player.queue.length - 1}
            aria-label="Titre suivant"
          >
            <NextIcon size={20} />
          </button>
        </div>
        <div className={progressRow}>
          <span>{formatDuration(currentTime)}</span>
          <input
            type="range"
            className={slider}
            min={0}
            max={duration || current.duration || 0}
            step={1}
            value={currentTime}
            onChange={(event) => player.seek(Number(event.target.value))}
            aria-label="Position de lecture"
          />
          <span>{formatDuration(duration || current.duration)}</span>
        </div>
      </div>

      <div className={volumeArea}>
        <VolumeIcon size={18} />
        <input
          type="range"
          className={slider}
          min={0}
          max={1}
          step={0.01}
          value={player.volume}
          onChange={(event) => player.setVolume(Number(event.target.value))}
          aria-label="Volume"
          style={{ width: 100, flex: "none" }}
        />
      </div>
    </div>
  )
}
