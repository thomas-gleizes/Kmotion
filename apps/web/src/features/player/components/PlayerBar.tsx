import { css, cx } from "styled-system/css"
import { useIsMobile } from "@/shared/hooks/useMediaQuery"
import { usePlayer, usePlayerProgress } from "@/features/player/state/PlayerContext"
import { thumbnailPath } from "@/shared/lib/audioCache"
import { formatDuration } from "@/shared/lib/format"
import { AuthImage } from "@/shared/ui/AuthImage"
import { MarqueeText } from "@/features/player/components/MarqueeText"
import {
  NextIcon,
  PauseIcon,
  PlayIcon,
  PrevIcon,
  RepeatIcon,
  ShuffleIcon,
  SpinnerIcon,
  VolumeIcon,
} from "@/shared/ui/icons"
import { MiniPlayer } from "./MiniPlayer"
import {
  artistStyle,
  bar,
  buttons,
  controlButton,
  controls,
  cover,
  expandTrigger,
  playButton,
  progressRow,
  repeatBadge,
  repeatWrap,
  slider,
  titleStyle,
  toggleActive,
  volumeArea,
} from "./PlayerBar.styles"

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
