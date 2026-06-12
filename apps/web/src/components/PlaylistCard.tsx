import { Link } from "@tanstack/react-router"
import { css, cx } from "styled-system/css"
import type { PlaylistSummary } from "../api/queries"
import { truncate } from "../lib/styles"
import { AuthImage } from "./AuthImage"

const card = css({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  padding: "10px",
  borderRadius: "m",
  transition: "background token(durations.fast) token(easings.apple)",
  _hover: { backgroundColor: "overlay" },
})

const mosaic = css({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gridTemplateRows: "1fr 1fr",
  aspectRatio: "1",
  borderRadius: "s",
  overflow: "hidden",
  boxShadow: "card",
  backgroundColor: "surfaceRaised",
})

const titleStyle = cx(truncate, css({ fontSize: "14px", fontWeight: "600" }))

const metaStyle = css({ fontSize: "12px", color: "textSecondary" })

export function PlaylistMosaic({ thumbnails }: { thumbnails: string[] }) {
  const cells = [0, 1, 2, 3].map((i) => thumbnails[i] ?? null)
  return (
    <div className={mosaic}>
      {cells.map((path, i) => (
        <AuthImage key={i} path={path} alt="" />
      ))}
    </div>
  )
}

export function PlaylistCard({ playlist }: { playlist: PlaylistSummary }) {
  return (
    <Link to="/playlists/$playlistId" params={{ playlistId: playlist.id }} className={card}>
      <PlaylistMosaic thumbnails={playlist.thumbnails} />
      <div>
        <div className={titleStyle}>{playlist.title}</div>
        <div className={metaStyle}>
          {playlist.entriesTotal} titre{playlist.entriesTotal > 1 ? "s" : ""} ·{" "}
          {playlist.visibility === "public" ? "Publique" : "Privée"}
        </div>
      </div>
    </Link>
  )
}
