import { css } from "styled-system/css"
import { usePlayer, usePlayerProgress } from "@/features/player/state/PlayerContext"
import { thumbnailPath } from "@/shared/lib/audioCache"
import { AuthImage } from "@/shared/ui/AuthImage"
import { MarqueeText } from "@/features/player/components/MarqueeText"
import { PauseIcon, PlayIcon, SpinnerIcon } from "@/shared/ui/icons"
import {
  artistStyle,
  miniBar,
  miniCover,
  miniExpand,
  miniPlayButton,
  miniProgressFill,
  miniProgressTrack,
  titleStyle,
} from "./PlayerBar.styles"

// Lecteur compact affiché sur mobile : pochette + titre défilant et un seul
// bouton lecture/pause, avec une fine barre de progression en haut.
export function MiniPlayer({ onExpand }: { onExpand?: () => void }) {
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
