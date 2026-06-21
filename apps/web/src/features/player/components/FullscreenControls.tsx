import { cx } from "styled-system/css"
import { usePlayer } from "@/features/player/state/PlayerContext"
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
import {
  controlsRow,
  ctrlBtn,
  playBtnExtra,
  repeatBadge,
  repeatWrap,
  toggleActive,
  volumeRow,
  volumeSlider,
} from "./FullscreenPlayer.styles"

// Barre de transport du lecteur plein écran (aléatoire / précédent / lecture /
// suivant / répétition) suivie du volume (masqué sur mobile).
export function FullscreenControls() {
  const player = usePlayer()

  return (
    <>
      <div className={controlsRow}>
        <button
          type="button"
          className={cx(ctrlBtn, player.shuffle && toggleActive)}
          onClick={player.toggleShuffle}
          aria-label="Lecture aléatoire"
          aria-pressed={player.shuffle}
          title="Lecture aléatoire (S)"
        >
          <ShuffleIcon size={22} />
        </button>
        <button
          type="button"
          className={ctrlBtn}
          onClick={player.prev}
          aria-label="Titre précédent"
          title="Titre précédent (P)"
        >
          <PrevIcon size={28} />
        </button>
        <button
          type="button"
          className={`${ctrlBtn} ${playBtnExtra}`}
          onClick={player.toggle}
          aria-label={player.isPlaying ? "Pause" : "Lecture"}
          title={player.isPlaying ? "Pause (Espace)" : "Lecture (Espace)"}
        >
          {player.isLoading ? (
            <SpinnerIcon size={22} />
          ) : player.isPlaying ? (
            <PauseIcon size={22} />
          ) : (
            <PlayIcon size={22} />
          )}
        </button>
        <button
          type="button"
          className={ctrlBtn}
          onClick={player.next}
          disabled={!player.hasNext}
          aria-label="Titre suivant"
          title="Titre suivant (N)"
        >
          <NextIcon size={28} />
        </button>
        <button
          type="button"
          className={cx(ctrlBtn, repeatWrap, player.repeat !== "off" && toggleActive)}
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
          <RepeatIcon size={22} />
          {player.repeat === "one" && <span className={repeatBadge}>1</span>}
        </button>
      </div>

      <div className={volumeRow}>
        <VolumeIcon size={16} />
        <input
          type="range"
          className={volumeSlider}
          min={0}
          max={1}
          step={0.01}
          value={player.volume}
          onChange={(e) => player.setVolume(Number(e.target.value))}
          aria-label="Volume"
        />
      </div>
    </>
  )
}
