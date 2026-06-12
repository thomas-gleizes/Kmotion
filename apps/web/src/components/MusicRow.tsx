import type { ReactNode } from "react"
import { css, cx } from "styled-system/css"
import { truncate } from "../lib/styles"
import { thumbnailPath } from "../player/audioCache"
import { formatDuration } from "../lib/format"
import { usePlayer } from "../player/PlayerContext"
import { AuthImage } from "./AuthImage"
import { PauseIcon, PlayIcon } from "./icons"

const row = css({
  display: "flex",
  alignItems: "center",
  gap: "14px",
  padding: "8px 12px",
  borderRadius: "s",
  cursor: "pointer",
  transition: "background token(durations.fast) token(easings.apple)",
  _hover: {
    backgroundColor: "overlay",
    "& .row-play": { opacity: 1 },
  },
})

const coverWrapper = css({
  position: "relative",
  width: "44px",
  height: "44px",
  borderRadius: "6px",
  overflow: "hidden",
  flexShrink: 0,
})

const playOverlay = css({
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  color: "white",
  opacity: 0,
  transition: "opacity token(durations.fast) token(easings.apple)",
})

const info = css({ flex: 1, minWidth: 0 })

const titleStyle = cx(
  truncate,
  css({
    fontSize: "14px",
    fontWeight: "500",
    "&[data-active=true]": { color: "accent" },
  }),
)

const artistStyle = cx(truncate, css({ fontSize: "12px", color: "textSecondary" }))

const durationStyle = css({
  fontSize: "12px",
  color: "textTertiary",
  fontVariantNumeric: "tabular-nums",
})

type Props = {
  id: string
  title: string
  artist: string
  duration: number
  onPlay: () => void
  actions?: ReactNode
}

export function MusicRow({ id, title, artist, duration, onPlay, actions }: Props) {
  const player = usePlayer()
  const isCurrent = player.current?.id === id

  return (
    <div className={row} onClick={onPlay}>
      <div className={coverWrapper}>
        <AuthImage path={thumbnailPath(id)} alt={title} />
        <div className={`${playOverlay} row-play`} style={isCurrent ? { opacity: 1 } : undefined}>
          {isCurrent && player.isPlaying ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
        </div>
      </div>
      <div className={info}>
        <div className={titleStyle} data-active={isCurrent}>
          {title}
        </div>
        <div className={artistStyle}>{artist}</div>
      </div>
      <span className={durationStyle}>{formatDuration(duration)}</span>
      {actions && <div onClick={(event) => event.stopPropagation()}>{actions}</div>}
    </div>
  )
}
