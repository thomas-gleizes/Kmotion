import { useState, type FormEvent } from "react"
import { createRoute, redirect } from "@tanstack/react-router"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { css, cx } from "styled-system/css"
import { appLayoutRoute } from "./app.layout"
import { isAuthenticated, getCurrentUser } from "../auth/auth"
import { musicsQuery, useUpdateMusic, type Music } from "../api/queries"
import { formatDuration } from "../lib/format"
import { truncate, emptyState, pageHeading } from "../lib/styles"
import { Button } from "../components/Button"
import { Modal } from "../components/Modal"
import { TextField } from "../components/TextField"
import { EditIcon } from "../components/icons"

const PAGE_SIZE = 30

const subHeading = css({
  color: "textSecondary",
  fontSize: "14px",
  marginTop: "-16px",
  marginBottom: "24px",
})

const row = css({
  display: "flex",
  alignItems: "center",
  gap: "16px",
  padding: "10px 12px",
  borderRadius: "s",
  transition: "background token(durations.fast) token(easings.apple)",
  _hover: { backgroundColor: "rgba(255,255,255,0.05)" },
})

const cellMain = css({ flex: 1, minWidth: 0 })
const rowTitle = cx(truncate, css({ fontSize: "15px", fontWeight: "600" }))
const rowArtist = cx(truncate, css({ fontSize: "13px", color: "textSecondary" }))
const rowDuration = css({
  fontSize: "13px",
  color: "textTertiary",
  fontVariantNumeric: "tabular-nums",
  flexShrink: 0,
})

const editButton = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "32px",
  height: "32px",
  borderRadius: "full",
  border: "none",
  background: "none",
  color: "textSecondary",
  cursor: "pointer",
  flexShrink: 0,
  transition: "all token(durations.fast) token(easings.apple)",
  _hover: { color: "accent", backgroundColor: "rgba(250, 45, 72, 0.12)" },
})

const pager = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "16px",
  marginTop: "28px",
  color: "textSecondary",
  fontSize: "14px",
})

const formStyle = css({ display: "flex", flexDirection: "column", gap: "16px" })
const formActions = css({ display: "flex", gap: "10px", justifyContent: "flex-end" })
const errorStyle = css({ color: "danger", fontSize: "13px" })

function MusicEditForm({ music, onClose }: { music: Music; onClose: () => void }) {
  const updateMusic = useUpdateMusic()
  const [title, setTitle] = useState(music.title)
  const [artist, setArtist] = useState(music.artist)

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    updateMusic.mutate(
      { id: music.id, body: { title: title.trim(), artist: artist.trim() } },
      { onSuccess: onClose },
    )
  }

  return (
    <form className={formStyle} onSubmit={onSubmit}>
      <TextField
        label="Titre"
        required
        autoFocus
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <TextField
        label="Artiste"
        required
        value={artist}
        onChange={(event) => setArtist(event.target.value)}
      />
      {updateMusic.isError && (
        <div className={errorStyle}>La mise à jour a échoué. Réessayez.</div>
      )}
      <div className={formActions}>
        <Button type="button" variant="ghost" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit" disabled={updateMusic.isPending || !title.trim() || !artist.trim()}>
          {updateMusic.isPending ? "Enregistrement…" : "Enregistrer"}
        </Button>
      </div>
    </form>
  )
}

const AdminPage = () => {
  const [page, setPage] = useState(0)
  const { data, isPending } = useQuery({
    ...musicsQuery(page, PAGE_SIZE),
    placeholderData: keepPreviousData,
  })
  const [editing, setEditing] = useState<Music | null>(null)

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1

  return (
    <div>
      <h1 className={pageHeading}>Administration</h1>
      <p className={subHeading}>Modifier les métadonnées des titres de la bibliothèque.</p>

      {isPending && <div className={emptyState}>Chargement…</div>}
      {data && data.records.length === 0 && (
        <div className={emptyState}>Aucun titre dans la bibliothèque.</div>
      )}

      {data?.records.map((music) => (
        <div key={music.id} className={row}>
          <div className={cellMain}>
            <div className={rowTitle}>{music.title}</div>
            <div className={rowArtist}>{music.artist}</div>
          </div>
          <span className={rowDuration}>{formatDuration(music.duration)}</span>
          <button
            type="button"
            className={editButton}
            onClick={() => setEditing(music)}
            aria-label={`Modifier ${music.title}`}
            title="Modifier les métadonnées"
          >
            <EditIcon size={18} />
          </button>
        </div>
      ))}

      {data && data.total > PAGE_SIZE && (
        <div className={pager}>
          <Button variant="ghost" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            Précédent
          </Button>
          <span>
            Page {page + 1} / {totalPages}
          </span>
          <Button
            variant="ghost"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Suivant
          </Button>
        </div>
      )}

      {editing && (
        <Modal title="Modifier le titre" onClose={() => setEditing(null)}>
          <MusicEditForm music={editing} onClose={() => setEditing(null)} />
        </Modal>
      )}
    </div>
  )
}

export const adminRoute = createRoute({
  path: "/admin",
  component: AdminPage,
  getParentRoute: () => appLayoutRoute,
  beforeLoad: () => {
    if (!isAuthenticated() || !getCurrentUser()?.isAdmin) {
      throw redirect({ to: "/", search: { page: 1 } })
    }
  },
})
