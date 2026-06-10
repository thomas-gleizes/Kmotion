import { useState } from "react"
import { createRoute, useNavigate } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { css } from "styled-system/css"
import { appLayoutRoute } from "./app.layout"
import {
  playlistQuery,
  useDeletePlaylist,
  useRemoveMusicFromPlaylist,
  useUpdatePlaylist,
  type PlaylistEntry,
} from "../api/queries"
import { usePlayer } from "../player/PlayerContext"
import { formatDuration } from "../lib/format"
import { PlaylistMosaic } from "../components/PlaylistCard"
import { MusicRow } from "../components/MusicRow"
import { Button } from "../components/Button"
import { Modal } from "../components/Modal"
import { PlaylistForm } from "../components/PlaylistForm"
import { emptyState } from "../lib/styles"
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PlayIcon,
  TrashIcon,
} from "../components/icons"

const headerStyle = css({
  display: "flex",
  gap: "28px",
  alignItems: "flex-end",
  marginBottom: "32px",
})

const mosaicWrapper = css({ width: "200px", flexShrink: 0 })

const infoStyle = css({ display: "flex", flexDirection: "column", gap: "10px", minWidth: 0 })

const titleStyle = css({ fontSize: "36px", fontWeight: "800", letterSpacing: "-1px" })

const descriptionStyle = css({ color: "textSecondary", fontSize: "14px" })

const metaStyle = css({ color: "textTertiary", fontSize: "13px" })

const actionsRow = css({ display: "flex", gap: "10px", marginTop: "6px" })

const entryActions = css({ display: "flex", alignItems: "center", gap: "2px" })

const iconButton = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "30px",
  height: "30px",
  borderRadius: "full",
  border: "none",
  background: "none",
  color: "textSecondary",
  cursor: "pointer",
  transition: "all token(durations.fast) token(easings.apple)",
  _hover: { color: "text", backgroundColor: "rgba(255, 255, 255, 0.08)" },
  _disabled: { opacity: 0.3, cursor: "default" },
})

const dangerHover = css({ _hover: { color: "danger !important" } })

const PlaylistDetailPage = () => {
  const { playlistId } = playlistDetailRoute.useParams()
  const navigate = useNavigate()
  const player = usePlayer()
  const { data: playlist, isPending } = useQuery(playlistQuery(playlistId))

  const updatePlaylist = useUpdatePlaylist(playlistId)
  const deletePlaylist = useDeletePlaylist()
  const removeMusic = useRemoveMusicFromPlaylist()
  const [showEdit, setShowEdit] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (isPending) return <div className={emptyState}>Chargement…</div>
  if (!playlist) return <div className={emptyState}>Playlist introuvable.</div>

  const entries = [...playlist.entries].sort((a, b) => a.position - b.position)
  const totalDuration = entries.reduce((sum, entry) => sum + entry.duration, 0)

  const moveEntry = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= entries.length) return
    const reordered = [...entries]
    ;[reordered[index], reordered[target]] = [reordered[target], reordered[index]]
    updatePlaylist.mutate({
      entries: reordered.map((entry: PlaylistEntry, i) => ({ musicId: entry.id, position: i + 1 })),
    })
  }

  return (
    <div>
      <div className={headerStyle}>
        <div className={mosaicWrapper}>
          <PlaylistMosaic thumbnails={playlist.thumbnails} />
        </div>
        <div className={infoStyle}>
          <h1 className={titleStyle}>{playlist.title}</h1>
          {playlist.description && (
            <p className={descriptionStyle}>{playlist.description}</p>
          )}
          <div className={metaStyle}>
            {playlist.user.name} · {entries.length} titre{entries.length > 1 ? "s" : ""} ·{" "}
            {formatDuration(totalDuration)} ·{" "}
            {playlist.visibility === "public" ? "Publique" : "Privée"}
          </div>
          <div className={actionsRow}>
            <Button onClick={() => player.playQueue(entries)} disabled={entries.length === 0}>
              <PlayIcon size={16} /> Tout lire
            </Button>
            <Button variant="ghost" onClick={() => setShowEdit(true)}>
              Modifier
            </Button>
            <Button variant="danger" onClick={() => setConfirmDelete(true)}>
              Supprimer
            </Button>
          </div>
        </div>
      </div>

      {entries.length === 0 && (
        <div className={emptyState}>
          Cette playlist est vide. Ajoutez des titres depuis la recherche.
        </div>
      )}
      {entries.map((entry, i) => (
        <MusicRow
          key={entry.id}
          id={entry.id}
          title={entry.title}
          artist={entry.artist}
          duration={entry.duration}
          onPlay={() => player.playQueue(entries, i)}
          actions={
            <div className={entryActions}>
              <button
                type="button"
                className={iconButton}
                disabled={i === 0 || updatePlaylist.isPending}
                onClick={() => moveEntry(i, -1)}
                aria-label="Monter"
              >
                <ChevronUpIcon size={16} />
              </button>
              <button
                type="button"
                className={iconButton}
                disabled={i === entries.length - 1 || updatePlaylist.isPending}
                onClick={() => moveEntry(i, 1)}
                aria-label="Descendre"
              >
                <ChevronDownIcon size={16} />
              </button>
              <button
                type="button"
                className={`${iconButton} ${dangerHover}`}
                disabled={removeMusic.isPending}
                onClick={() => removeMusic.mutate({ playlistId, musicId: entry.id })}
                aria-label="Retirer de la playlist"
              >
                <TrashIcon size={16} />
              </button>
            </div>
          }
        />
      ))}

      {showEdit && (
        <Modal title="Modifier la playlist" onClose={() => setShowEdit(false)}>
          <PlaylistForm
            initial={{
              title: playlist.title,
              description: playlist.description,
              visibility: playlist.visibility,
            }}
            pending={updatePlaylist.isPending}
            submitLabel="Enregistrer"
            onSubmit={(values) =>
              updatePlaylist.mutate(values, { onSuccess: () => setShowEdit(false) })
            }
          />
        </Modal>
      )}

      {confirmDelete && (
        <Modal title="Supprimer la playlist ?" onClose={() => setConfirmDelete(false)}>
          <p className={css({ color: "textSecondary", fontSize: "14px", marginBottom: "20px" })}>
            « {playlist.title} » sera définitivement supprimée. Les titres restent dans votre
            bibliothèque.
          </p>
          <div className={css({ display: "flex", gap: "10px", justifyContent: "flex-end" })}>
            <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
              Annuler
            </Button>
            <Button
              variant="danger"
              disabled={deletePlaylist.isPending}
              onClick={() =>
                deletePlaylist.mutate(playlistId, {
                  onSuccess: () => void navigate({ to: "/playlists" }),
                })
              }
            >
              Supprimer
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
}

export const playlistDetailRoute = createRoute({
  path: "/playlists/$playlistId",
  component: PlaylistDetailPage,
  getParentRoute: () => appLayoutRoute,
})
