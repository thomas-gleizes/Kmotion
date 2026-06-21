import { cx } from "styled-system/css"
import { usePlayer, usePlayerProgress } from "@/features/player/state/PlayerContext"
import { thumbnailPath } from "@/shared/lib/audioCache"
import { useAuthedBlobUrl } from "@/shared/hooks/useAuthedBlobUrl"
import { formatDuration } from "@/shared/lib/format"
import { AuthImage } from "@/shared/ui/AuthImage"
import { MarqueeText } from "@/features/player/components/MarqueeText"
import { ChevronDownIcon } from "@/shared/ui/icons"
import { useFullscreenTransition } from "@/features/player/hooks/useFullscreenTransition"
import { FullscreenControls } from "./FullscreenControls"
import { QueuePanel } from "./QueuePanel"
import {
  ambientBg,
  artBase,
  artPaused,
  artSection,
  body,
  closeBtn,
  grabber,
  grabberZone,
  header,
  infoSection,
  nowPlayingLabel,
  overlay,
  overlayEntering,
  overlayExiting,
  progressBlock,
  progressSlider,
  scrim,
  timesRow,
  trackArtist,
  trackTitle,
} from "./FullscreenPlayer.styles"

export function FullscreenPlayer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const player = usePlayer()
  const { currentTime, duration } = usePlayerProgress()
  const { render, closing, dragHandlers, overlayStyle, onAnimationEnd, onTransitionEnd } =
    useFullscreenTransition(open, onClose)
  const { url: artUrl } = useAuthedBlobUrl(
    render && player.current ? thumbnailPath(player.current.id) : null,
  )

  if (!render || !player.current) return null
  const { current } = player

  return (
    <div
      className={cx(overlay, !closing && (open ? overlayEntering : overlayExiting))}
      style={overlayStyle}
      onAnimationEnd={onAnimationEnd}
      onTransitionEnd={onTransitionEnd}
    >
      <div className={grabberZone} {...dragHandlers}>
        <span className={grabber} aria-hidden />
      </div>
      {artUrl && (
        <div
          key={current.id}
          className={ambientBg}
          style={{ backgroundImage: `url(${artUrl})` }}
          aria-hidden
        />
      )}
      <div className={scrim} aria-hidden />
      <div className={header} {...dragHandlers}>
        <button
          type="button"
          className={closeBtn}
          onClick={onClose}
          aria-label="Réduire"
          title="Réduire (F / Échap)"
        >
          <ChevronDownIcon size={22} />
        </button>
        <span className={nowPlayingLabel}>En lecture</span>
        <div style={{ width: 38 }} />
      </div>

      <div className={body}>
        <div className={artSection}>
          <div className={cx(artBase, !player.isPlaying && artPaused)}>
            <AuthImage path={thumbnailPath(current.id)} alt={current.title} />
          </div>
        </div>

        <div className={infoSection}>
          <div>
            <MarqueeText text={current.title} className={trackTitle} />
            <MarqueeText text={current.artist} className={trackArtist} />
          </div>

          <div className={progressBlock}>
            <input
              type="range"
              className={progressSlider}
              min={0}
              max={duration || current.duration || 0}
              step={1}
              value={currentTime}
              onChange={(e) => player.seek(Number(e.target.value))}
              aria-label="Position de lecture"
            />
            <div className={timesRow}>
              <span>{formatDuration(currentTime)}</span>
              <span>{formatDuration(duration || current.duration)}</span>
            </div>
          </div>

          <FullscreenControls />

          <QueuePanel />
        </div>
      </div>
    </div>
  )
}
