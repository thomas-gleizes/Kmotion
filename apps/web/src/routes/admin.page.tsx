import { useState, type FormEvent } from "react"
import { createRoute, redirect } from "@tanstack/react-router"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { css, cx } from "styled-system/css"
import { appLayoutRoute } from "./app.layout"
import { isAuthenticated, getCurrentUser } from "../auth/auth"
import {
  musicsQuery,
  usersQuery,
  useSyncMusics,
  useUpdateMusic,
  useDeleteMusic,
  useBanUser,
  useUnbanUser,
  useDeleteUser,
  type Music,
  type User,
} from "../api/queries"
import { formatDuration } from "../lib/format"
import { truncate, emptyState, pageHeading } from "../lib/styles"
import { Button } from "../components/Button"
import { Modal } from "../components/Modal"
import { TextField } from "../components/TextField"
import { EditIcon, SpinnerIcon, SyncIcon, TrashIcon } from "../components/icons"

const PAGE_SIZE = 30

const tabs = css({
  display: "flex",
  gap: "8px",
  marginBottom: "24px",
  borderBottom: "1px solid token(colors.border)",
})

const tab = css({
  padding: "10px 4px",
  marginBottom: "-1px",
  background: "none",
  border: "none",
  borderBottom: "2px solid transparent",
  color: "textSecondary",
  fontSize: "15px",
  fontWeight: "600",
  fontFamily: "sans",
  cursor: "pointer",
  transition: "all token(durations.fast) token(easings.apple)",
  _hover: { color: "text" },
})

const tabActive = css({ color: "text", borderBottomColor: "accent" })

const sectionHeader = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
  marginBottom: "16px",
})

const sectionTitle = css({ fontSize: "14px", color: "textSecondary" })

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
const rowSub = cx(truncate, css({ fontSize: "13px", color: "textSecondary" }))
const rowDuration = css({
  fontSize: "13px",
  color: "textTertiary",
  fontVariantNumeric: "tabular-nums",
  flexShrink: 0,
})

const badge = css({
  display: "inline-block",
  marginLeft: "8px",
  padding: "1px 7px",
  borderRadius: "full",
  fontSize: "10px",
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  verticalAlign: "middle",
})
const adminBadge = cx(badge, css({ backgroundColor: "rgba(94, 92, 230, 0.22)", color: "#b7b6ff" }))
const bannedBadge = cx(badge, css({ backgroundColor: "rgba(255, 69, 58, 0.18)", color: "danger" }))

const actions = css({ display: "flex", gap: "8px", flexShrink: 0 })

const iconButton = css({
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

const dangerIconButton = cx(
  iconButton,
  css({ _hover: { color: "danger !important", backgroundColor: "rgba(255, 69, 58, 0.12)" } }),
)

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
const syncFeedback = css({ fontSize: "13px", marginTop: "10px" })
const syncOk = css({ color: "accent" })
const syncError = css({ color: "danger" })
const confirmText = css({ color: "textSecondary", fontSize: "14px", marginBottom: "20px" })

function Pager({
  page,
  totalPages,
  onChange,
}: {
  page: number
  totalPages: number
  onChange: (page: number) => void
}) {
  return (
    <div className={pager}>
      <Button variant="ghost" disabled={page === 0} onClick={() => onChange(page - 1)}>
        Précédent
      </Button>
      <span>
        Page {page + 1} / {totalPages}
      </span>
      <Button variant="ghost" disabled={page + 1 >= totalPages} onClick={() => onChange(page + 1)}>
        Suivant
      </Button>
    </div>
  )
}

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
      {updateMusic.isError && <div className={errorStyle}>La mise à jour a échoué. Réessayez.</div>}
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

function MusicsSection() {
  const [page, setPage] = useState(0)
  const { data, isPending } = useQuery({
    ...musicsQuery(page, PAGE_SIZE),
    placeholderData: keepPreviousData,
  })
  const [editing, setEditing] = useState<Music | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Music | null>(null)
  const syncMusics = useSyncMusics()
  const deleteMusic = useDeleteMusic()

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1

  return (
    <div>
      <div className={sectionHeader}>
        <span className={sectionTitle}>Modifier les métadonnées des titres.</span>
        <Button variant="ghost" disabled={syncMusics.isPending} onClick={() => syncMusics.mutate()}>
          {syncMusics.isPending ? <SpinnerIcon size={16} /> : <SyncIcon size={16} />}
          {syncMusics.isPending ? "Synchronisation…" : "Synchroniser"}
        </Button>
      </div>
      {syncMusics.isSuccess && (
        <div className={cx(syncFeedback, syncOk)}>Bibliothèque synchronisée.</div>
      )}
      {syncMusics.isError && (
        <div className={cx(syncFeedback, syncError)}>La synchronisation a échoué. Réessayez.</div>
      )}

      {isPending && <div className={emptyState}>Chargement…</div>}
      {data && data.records.length === 0 && (
        <div className={emptyState}>Aucun titre dans la bibliothèque.</div>
      )}

      {data?.records.map((music) => (
        <div key={music.id} className={row}>
          <div className={cellMain}>
            <div className={rowTitle}>{music.title}</div>
            <div className={rowSub}>{music.artist}</div>
          </div>
          <span className={rowDuration}>{formatDuration(music.duration)}</span>
          <div className={actions}>
            <button
              type="button"
              className={iconButton}
              onClick={() => setEditing(music)}
              aria-label={`Modifier ${music.title}`}
              title="Modifier les métadonnées"
            >
              <EditIcon size={18} />
            </button>
            <button
              type="button"
              className={dangerIconButton}
              onClick={() => setConfirmDelete(music)}
              aria-label={`Supprimer ${music.title}`}
              title="Supprimer le titre"
            >
              <TrashIcon size={18} />
            </button>
          </div>
        </div>
      ))}

      {data && data.total > PAGE_SIZE && (
        <Pager page={page} totalPages={totalPages} onChange={setPage} />
      )}

      {editing && (
        <Modal title="Modifier le titre" onClose={() => setEditing(null)}>
          <MusicEditForm music={editing} onClose={() => setEditing(null)} />
        </Modal>
      )}

      {confirmDelete && (
        <Modal title="Supprimer le titre ?" onClose={() => setConfirmDelete(null)}>
          <p className={confirmText}>
            « {confirmDelete.title} » sera définitivement supprimé de la bibliothèque et de toutes
            les playlists. Cette action est irréversible.
          </p>
          <div className={formActions}>
            <Button variant="ghost" onClick={() => setConfirmDelete(null)}>
              Annuler
            </Button>
            <Button
              variant="danger"
              disabled={deleteMusic.isPending}
              onClick={() =>
                deleteMusic.mutate(confirmDelete.id, { onSuccess: () => setConfirmDelete(null) })
              }
            >
              {deleteMusic.isPending ? "Suppression…" : "Supprimer"}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
}

function UsersSection() {
  const [page, setPage] = useState(0)
  const { data, isPending } = useQuery({
    ...usersQuery(page, PAGE_SIZE),
    placeholderData: keepPreviousData,
  })
  const banUser = useBanUser()
  const unbanUser = useUnbanUser()
  const deleteUser = useDeleteUser()
  const [confirmDelete, setConfirmDelete] = useState<User | null>(null)
  const currentUserId = getCurrentUser()?.sub

  const busy = banUser.isPending || unbanUser.isPending || deleteUser.isPending
  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1

  return (
    <div>
      <div className={sectionHeader}>
        <span className={sectionTitle}>Bannir, réactiver ou supprimer des utilisateurs.</span>
      </div>

      {isPending && <div className={emptyState}>Chargement…</div>}
      {data && data.records.length === 0 && <div className={emptyState}>Aucun utilisateur.</div>}

      {data?.records.map((user) => {
        const isSelf = user.id === currentUserId
        return (
          <div key={user.id} className={row}>
            <div className={cellMain}>
              <div className={rowTitle}>
                {user.name}
                {user.isAdmin && <span className={adminBadge}>Admin</span>}
                {!user.isActive && <span className={bannedBadge}>Banni</span>}
              </div>
              <div className={rowSub}>{user.email}</div>
            </div>
            <div className={actions}>
              {user.isActive ? (
                <Button
                  variant="ghost"
                  disabled={busy || isSelf}
                  title={isSelf ? "Vous ne pouvez pas vous bannir" : undefined}
                  onClick={() => banUser.mutate(user.id)}
                >
                  Bannir
                </Button>
              ) : (
                <Button variant="ghost" disabled={busy} onClick={() => unbanUser.mutate(user.id)}>
                  Réactiver
                </Button>
              )}
              <Button
                variant="danger"
                disabled={busy || isSelf}
                title={isSelf ? "Vous ne pouvez pas vous supprimer" : undefined}
                onClick={() => setConfirmDelete(user)}
              >
                Supprimer
              </Button>
            </div>
          </div>
        )
      })}

      {data && data.total > PAGE_SIZE && (
        <Pager page={page} totalPages={totalPages} onChange={setPage} />
      )}

      {confirmDelete && (
        <Modal title="Supprimer l’utilisateur ?" onClose={() => setConfirmDelete(null)}>
          <p className={confirmText}>
            « {confirmDelete.name} » sera définitivement supprimé, ainsi que ses playlists. Cette
            action est irréversible.
          </p>
          <div className={formActions}>
            <Button variant="ghost" onClick={() => setConfirmDelete(null)}>
              Annuler
            </Button>
            <Button
              variant="danger"
              disabled={deleteUser.isPending}
              onClick={() =>
                deleteUser.mutate(confirmDelete.id, { onSuccess: () => setConfirmDelete(null) })
              }
            >
              {deleteUser.isPending ? "Suppression…" : "Supprimer"}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
}

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<"musics" | "users">("musics")

  return (
    <div>
      <h1 className={pageHeading}>Administration</h1>
      <div className={tabs}>
        <button
          type="button"
          className={cx(tab, activeTab === "musics" && tabActive)}
          onClick={() => setActiveTab("musics")}
        >
          Bibliothèque
        </button>
        <button
          type="button"
          className={cx(tab, activeTab === "users" && tabActive)}
          onClick={() => setActiveTab("users")}
        >
          Utilisateurs
        </button>
      </div>

      {activeTab === "musics" ? <MusicsSection /> : <UsersSection />}
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
