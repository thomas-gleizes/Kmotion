import { css, cx } from "styled-system/css"
import type { Music } from "../api/queries"
import { truncate } from "../lib/styles"
import { thumbnailPath } from "../player/audioCache"
import { AuthImage } from "./AuthImage"
import { PlayIcon, PlusIcon } from "./icons"

const card = css({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  cursor: "pointer",
  borderRadius: "m",
  padding: "10px",
  transition: "background token(durations.fast) token(easings.apple)",
  _hover: {
    backgroundColor: "overlay",
    "& .play-overlay": { opacity: 1 },
    "& .add-corner": { opacity: 1 },
  },
})

const coverWrapper = css({
  position: "relative",
  aspectRatio: "1",
  borderRadius: "s",
  overflow: "hidden",
  boxShadow: "card",
})

const overlay = css({
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  opacity: 0,
  transition: "opacity token(durations.fast) token(easings.apple)",
})

const playCircle = css({
  width: "48px",
  height: "48px",
  borderRadius: "full",
  backgroundColor: "accent",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 4px 16px rgba(250, 45, 72, 0.5)",
})

const addCorner = css({
  position: "absolute",
  top: "8px",
  right: "8px",
  width: "30px",
  height: "30px",
  borderRadius: "full",
  border: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0, 0, 0, 0.55)",
  color: "white",
  cursor: "pointer",
  opacity: 0,
  transition: "all token(durations.fast) token(easings.apple)",
  _hover: { backgroundColor: "accent", transform: "scale(1.1)" },
  // Toujours visible sur écran tactile (pas de hover pour le révéler).
  _touch: { opacity: 1, width: "36px", height: "36px" },
})

const titleStyle = cx(truncate, css({ fontSize: "14px", fontWeight: "600" }))

const artistStyle = cx(truncate, css({ fontSize: "12px", color: "textSecondary" }))

type Props = {
  music: Music
  onPlay: () => void
  onAddToPlaylist?: () => void
}

export function MusicCard({ music, onPlay, onAddToPlaylist }: Props) {
  return (
    <div className={card} onClick={onPlay}>
      <div className={coverWrapper}>
        <AuthImage path={thumbnailPath(music.id)} alt={music.title} />
        <div className={`${overlay} play-overlay`}>
          <div className={playCircle}>
            <PlayIcon size={22} />
          </div>
        </div>
        {onAddToPlaylist && (
          <button
            type="button"
            className={`${addCorner} add-corner`}
            aria-label="Ajouter à une playlist"
            onClick={(event) => {
              event.stopPropagation()
              onAddToPlaylist()
            }}
          >
            <PlusIcon size={16} />
          </button>
        )}
      </div>
      <div>
        <div className={titleStyle}>{music.title}</div>
        <div className={artistStyle}>{music.artist}</div>
      </div>
    </div>
  )
}
