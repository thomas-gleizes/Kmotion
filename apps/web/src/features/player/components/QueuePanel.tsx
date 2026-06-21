import { cx } from "styled-system/css"
import { usePlayer } from "@/features/player/state/PlayerContext"
import { formatDuration } from "@/shared/lib/format"
import {
  queueDur,
  queueIdx,
  queueItem,
  queueItemActive,
  queueLabel,
  queueList,
  queueSection,
  queueTrackArtist,
  queueTrackTitle,
} from "./FullscreenPlayer.styles"

// File de lecture du lecteur plein écran : un clic relance la lecture à la
// position choisie.
export function QueuePanel() {
  const player = usePlayer()

  if (player.queue.length === 0) return null

  return (
    <div className={queueSection}>
      <div className={queueLabel}>File de lecture</div>
      <div className={queueList}>
        {player.queue.map((track, i) => (
          <button
            key={track.id}
            type="button"
            className={cx(queueItem, i === player.index && queueItemActive)}
            onClick={() => player.playQueue(player.queue, i)}
          >
            <span className={queueIdx}>{i + 1}</span>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div className={queueTrackTitle}>{track.title}</div>
              <div className={queueTrackArtist}>{track.artist}</div>
            </div>
            <span className={queueDur}>{formatDuration(track.duration)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
