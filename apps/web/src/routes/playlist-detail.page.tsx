import { createRoute, useNavigate } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { useDialog } from "react-dialog-promise"
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
import { PlaylistFormDialog } from "../components/dialogs/PlaylistFormDialog"
import { ConfirmDialog } from "../components/dialogs/ConfirmDialog"
import { AddMusicsToPlaylistDialog } from "../components/dialogs/AddMusicsToPlaylistDialog"
import { emptyState } from "../lib/styles"
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PlayIcon,
  PlusIcon,
  TrashIcon,
} from "../components/icons"

const headerStyle = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  gap: "16px",
  marginBottom: "24px",
  md: {
    flexDirection: "row",
    alignItems: "flex-end",
    textAlign: "left",
    gap: "28px",
    marginBottom: "32px",
  },
})

const mosaicWrapper = css({ width: "180px", flexShrink: 0, md: { width: "200px" } })

const infoStyle = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "10px",
  minWidth: 0,
  md: { alignItems: "flex-start" },
})

const titleStyle = css({
  fontSize: "clamp(26px, 7vw, 36px)",
  fontWeight: "800",
  letterSpacing: "-1px",
})

const descriptionStyle = css({ color: "textSecondary", fontSize: "14px" })

const metaStyle = css({ color: "textTertiary", fontSize: "13px" })

const actionsRow = css({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "10px",
  marginTop: "6px",
  md: { justifyContent: "flex-start" },
})

const entryActions = css({ display: "flex", alignItems: "center", gap: "2px" })

const iconButton = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "30px",
  height: "30px",
  _touch: { width: "40px", height: "40px" },
  borderRadius: "full",
  border: "none",
  background: "none",
  color: "textSecondary",
  cursor: "pointer",
  transition: "all token(durations.fast) token(easings.apple)",
  _hover: { color: "text", backgroundColor: "overlayStrong" },
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
  const editDialog = useDialog(PlaylistFormDialog)
  const confirmDialog = useDialog(ConfirmDialog)
  const addMusicsDialog = useDialog(AddMusicsToPlaylistDialog)

  if (isPending) return <div className={emptyState}>Chargement…</div>
  if (!playlist) return <div className={emptyState}>Playlist introuvable.</div>

  const openEdit = () =>
    editDialog.open({
      heading: "Modifier la playlist",
      submitLabel: "Enregistrer",
      initial: {
        title: playlist.title,
        description: playlist.description,
        visibility: playlist.visibility,
      },
      onSubmit: (values) => updatePlaylist.mutateAsync(values),
    })

  const openDelete = async () => {
    const confirmed = await confirmDialog.open({
      title: "Supprimer la playlist ?",
      message: `« ${playlist.title} » sera définitivement supprimée. Les titres restent dans votre bibliothèque.`,
      confirmLabel: "Supprimer",
      danger: true,
    })
    if (confirmed) {
      deletePlaylist.mutate(playlistId, { onSuccess: () => void navigate({ to: "/playlists" }) })
    }
  }

  const entries = [...playlist.entries].sort((a, b) => a.position - b.position)
  const totalDuration = entries.reduce((sum, entry) => sum + entry.duration, 0)

  const openAddMusics = () =>
    addMusicsDialog.open({ playlistId, existingIds: entries.map((entry) => entry.id) })

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
            <Button variant="ghost" onClick={openAddMusics}>
              <PlusIcon size={16} /> Ajouter des titres
            </Button>
            <Button variant="ghost" onClick={openEdit}>
              Modifier
            </Button>
            <Button variant="danger" onClick={openDelete}>
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
    </div>
  )
}

export const playlistDetailRoute = createRoute({
  path: "/playlists/$playlistId",
  component: PlaylistDetailPage,
  getParentRoute: () => appLayoutRoute,
})
