import { css, cx } from "styled-system/css"
import { truncate } from "../lib/styles"
import { useIsMobile } from "../hooks/useMediaQuery"
import { usePlayer, usePlayerProgress } from "../player/PlayerContext"
import { thumbnailPath } from "../player/audioCache"
import { formatDuration } from "../lib/format"
import { AuthImage } from "./AuthImage"
import { MarqueeText } from "./MarqueeText"
import {
  NextIcon,
  PauseIcon,
  PlayIcon,
  PrevIcon,
  RepeatIcon,
  ShuffleIcon,
  SpinnerIcon,
  VolumeIcon,
} from "./icons"

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

const toggleActive = css({
  color: "accent !important",
  _hover: { color: "accentHover !important" },
})

const repeatWrap = css({ position: "relative" })

const repeatBadge = css({
  position: "absolute",
  top: "0",
  right: "0",
  minWidth: "12px",
  height: "12px",
  padding: "0 2px",
  borderRadius: "full",
  backgroundColor: "accent",
  color: "white",
  fontSize: "8px",
  fontWeight: "700",
  lineHeight: "12px",
  textAlign: "center",
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
  backgroundColor: "overlayIntense",
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

const miniBar = css({
  gridArea: "player",
  position: "relative",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "8px 12px",
  backgroundColor: "surfaceTranslucent",
  backdropFilter: "blur(20px) saturate(180%)",
  borderTop: "1px solid token(colors.border)",
  boxShadow: "bar",
  animation: "fadeIn token(durations.normal) token(easings.apple)",
})

const miniProgressTrack = css({
  position: "absolute",
  top: "-1px",
  left: 0,
  right: 0,
  height: "2px",
  backgroundColor: "overlayStrong",
})

const miniProgressFill = css({
  height: "100%",
  backgroundColor: "accent",
})

const miniExpand = css({
  flex: 1,
  display: "flex",
  alignItems: "center",
  gap: "12px",
  minWidth: 0,
  background: "none",
  border: "none",
  color: "text",
  cursor: "pointer",
  padding: 0,
  textAlign: "left",
})

const miniCover = css({
  width: "40px",
  height: "40px",
  borderRadius: "s",
  overflow: "hidden",
  flexShrink: 0,
})

const miniPlayButton = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "44px",
  height: "44px",
  borderRadius: "full",
  border: "none",
  background: "none",
  color: "text",
  cursor: "pointer",
  flexShrink: 0,
})

function MiniPlayer({ onExpand }: { onExpand?: () => void }) {
  const player = usePlayer()
  const { currentTime, duration } = usePlayerProgress()

  if (!player.current) return null
  const { current } = player
  const total = duration || current.duration || 0
  const progress = total > 0 ? Math.min(100, (currentTime / total) * 100) : 0

  return (
    <div className={miniBar}>
      <div className={miniProgressTrack}>
        <div className={miniProgressFill} style={{ width: `${progress}%` }} />
      </div>
      <button
        type="button"
        className={miniExpand}
        onClick={onExpand}
        aria-label="Agrandir le lecteur"
      >
        <div className={miniCover}>
          <AuthImage path={thumbnailPath(current.id)} alt={current.title} />
        </div>
        <div className={css({ minWidth: 0 })}>
          <MarqueeText text={current.title} className={titleStyle} />
          <MarqueeText text={current.artist} className={artistStyle} />
        </div>
      </button>
      <button
        type="button"
        className={miniPlayButton}
        onClick={player.toggle}
        aria-label={player.isPlaying ? "Pause" : "Lecture"}
      >
        {player.isLoading ? (
          <SpinnerIcon size={22} />
        ) : player.isPlaying ? (
          <PauseIcon size={22} />
        ) : (
          <PlayIcon size={22} />
        )}
      </button>
    </div>
  )
}

export function PlayerBar({ onExpand }: { onExpand?: () => void }) {
  const player = usePlayer()
  const { currentTime, duration } = usePlayerProgress()
  const isMobile = useIsMobile()

  if (isMobile) return <MiniPlayer onExpand={onExpand} />

  if (!player.current) return null
  const { current } = player

  return (
    <div className={bar}>
      <button
        type="button"
        className={expandTrigger}
        onClick={onExpand}
        aria-label="Agrandir le lecteur"
        title="Agrandir le lecteur (F)"
      >
        <div className={cover}>
          <AuthImage path={thumbnailPath(current.id)} alt={current.title} />
        </div>
        <div className={css({ minWidth: 0 })}>
          <MarqueeText text={current.title} className={titleStyle} />
          <MarqueeText text={current.artist} className={artistStyle} />
        </div>
      </button>

      <div className={controls}>
        <div className={buttons}>
          <button
            type="button"
            className={cx(controlButton, player.shuffle && toggleActive)}
            onClick={player.toggleShuffle}
            aria-label="Lecture aléatoire"
            aria-pressed={player.shuffle}
            title="Lecture aléatoire (S)"
          >
            <ShuffleIcon size={18} />
          </button>
          <button
            type="button"
            className={controlButton}
            onClick={player.prev}
            aria-label="Titre précédent"
            title="Titre précédent (P)"
          >
            <PrevIcon size={20} />
          </button>
          <button
            type="button"
            className={`${controlButton} ${playButton}`}
            onClick={player.toggle}
            aria-label={player.isPlaying ? "Pause" : "Lecture"}
            title={player.isPlaying ? "Pause (Espace)" : "Lecture (Espace)"}
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
            disabled={!player.hasNext}
            aria-label="Titre suivant"
            title="Titre suivant (N)"
          >
            <NextIcon size={20} />
          </button>
          <button
            type="button"
            className={cx(controlButton, repeatWrap, player.repeat !== "off" && toggleActive)}
            onClick={player.cycleRepeat}
            aria-label={
              player.repeat === "one"
                ? "Répéter le titre"
                : player.repeat === "all"
                  ? "Répéter la file"
                  : "Répétition désactivée"
            }
            aria-pressed={player.repeat !== "off"}
            title="Répétition (R)"
          >
            <RepeatIcon size={18} />
            {player.repeat === "one" && <span className={repeatBadge}>1</span>}
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
