import { useState } from "react"
import { type DialogComponent } from "react-dialog-promise"
import { useQuery } from "@tanstack/react-query"
import { css, cx } from "styled-system/css"
import {
  playlistQuery,
  playlistsQuery,
  useAddMusicToPlaylist,
  type Music,
  type PlaylistSummary,
} from "../../api/queries"
import { Modal } from "../Modal"
import { PlaylistMosaic } from "../PlaylistCard"
import { CheckIcon, PlusIcon, SearchIcon } from "../icons"

const searchBox = css({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "10px 14px",
  borderRadius: "m",
  backgroundColor: "surfaceRaised",
  border: "1px solid token(colors.border)",
  marginBottom: "12px",
  color: "textSecondary",
  transition: "all token(durations.fast) token(easings.apple)",
  _focusWithin: { borderColor: "accent", boxShadow: "0 0 0 3px token(colors.accentGlow)" },
})

const searchInput = css({
  flex: 1,
  background: "none",
  border: "none",
  outline: "none",
  color: "text",
  fontSize: "15px",
  fontFamily: "sans",
  _placeholder: { color: "textTertiary" },
})

const list = css({ display: "flex", flexDirection: "column", gap: "4px" })

const item = css({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "8px 10px",
  borderRadius: "s",
  cursor: "pointer",
  background: "none",
  border: "none",
  color: "text",
  fontFamily: "sans",
  textAlign: "left",
  width: "100%",
  transition: "background token(durations.fast) token(easings.apple)",
  _hover: { backgroundColor: "overlayStrong" },
  _disabled: { opacity: 0.5, cursor: "default" },
})

const mosaicSize = css({ width: "44px", flexShrink: 0 })
const emptyStyle = css({ color: "textSecondary", fontSize: "14px", padding: "8px 0" })
const textCol = css({ flex: 1, minWidth: 0 })
const subText = css({ color: "textSecondary", fontSize: "12px", display: "block" })

const statusCircle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "28px",
  height: "28px",
  borderRadius: "full",
  flexShrink: 0,
  backgroundColor: "overlayStrong",
  color: "textSecondary",
})

const statusInPlaylist = css({ color: "success" })

type PlaylistItemProps = {
  playlist: PlaylistSummary
  music: Music
  onAdded: () => void
}

function PlaylistItem({ playlist, music, onAdded }: PlaylistItemProps) {
  const { data: detail } = useQuery(playlistQuery(playlist.id))
  const addMusic = useAddMusicToPlaylist()
  const isInPlaylist = detail?.entries.some((entry) => entry.id === music.id) ?? false

  return (
    <button
      type="button"
      className={item}
      disabled={isInPlaylist || addMusic.isPending}
      onClick={() =>
        addMusic.mutate(
          { playlistId: playlist.id, musicId: music.id, position: playlist.entriesTotal + 1 },
          { onSuccess: onAdded },
        )
      }
    >
      <span className={mosaicSize}>
        <PlaylistMosaic thumbnails={playlist.thumbnails} />
      </span>
      <span className={textCol}>
        {playlist.title}
        <span className={subText}>
          {playlist.entriesTotal} titre{playlist.entriesTotal > 1 ? "s" : ""}
        </span>
      </span>
      <span className={cx(statusCircle, isInPlaylist && statusInPlaylist)}>
        {isInPlaylist ? <CheckIcon size={16} /> : <PlusIcon size={16} />}
      </span>
    </button>
  )
}

export const AddToPlaylistDialog: DialogComponent<{ music: Music }, void> = ({
  isOpen,
  close,
  music,
}) => {
  const { data: playlists } = useQuery(playlistsQuery)
  const [filter, setFilter] = useState("")

  const filtered = playlists?.filter((playlist) =>
    playlist.title.toLowerCase().includes(filter.trim().toLowerCase()),
  )

  return (
    <Modal title={`Ajouter « ${music.title} »`} open={isOpen} onClose={() => close()}>
      {playlists?.length === 0 && (
        <p className={emptyStyle}>Aucune playlist. Créez-en une depuis l’onglet Playlists.</p>
      )}
      {playlists != null && playlists.length > 0 && (
        <div className={searchBox}>
          <SearchIcon size={16} />
          <input
            className={searchInput}
            placeholder="Filtrer les playlists…"
            autoFocus
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          />
        </div>
      )}
      {filtered?.length === 0 && playlists != null && playlists.length > 0 && (
        <p className={emptyStyle}>Aucune playlist ne correspond à « {filter} ».</p>
      )}
      <div className={list}>
        {filtered?.map((playlist) => (
          <PlaylistItem key={playlist.id} playlist={playlist} music={music} onAdded={() => close()} />
        ))}
      </div>
    </Modal>
  )
}
