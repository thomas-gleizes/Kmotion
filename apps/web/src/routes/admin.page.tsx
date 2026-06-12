import { useState } from "react"
import { createRoute, redirect } from "@tanstack/react-router"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useDialog } from "react-dialog-promise"
import { css, cx } from "styled-system/css"
import { appLayoutRoute } from "./app.layout"
import { isAuthenticated, getCurrentUser } from "../auth/auth"
import {
  musicsQuery,
  usersQuery,
  useSyncMusics,
  useDeleteMusic,
  useBanUser,
  useUnbanUser,
  useDeleteUser,
  type Music,
  type User,
} from "../api/queries"
import { formatDuration, formatDate, formatRelativeTime } from "../lib/format"
import { truncate, emptyState, pageHeading } from "../lib/styles"
import { Button } from "../components/Button"
import { MusicEditDialog } from "../components/dialogs/MusicEditDialog"
import { ConfirmDialog } from "../components/dialogs/ConfirmDialog"
import { useDebounce } from "../hooks/useDebounce"
import { EditIcon, SearchIcon, SpinnerIcon, SyncIcon, TrashIcon } from "../components/icons"

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
  flexWrap: "wrap",
  gap: "8px 16px",
  padding: "10px 12px",
  md: { flexWrap: "nowrap", gap: "16px" },
  borderRadius: "s",
  transition: "background token(durations.fast) token(easings.apple)",
  _hover: { backgroundColor: "overlay" },
})

const cellMain = css({ flex: 1, minWidth: 0 })
const rowTitle = cx(truncate, css({ fontSize: "15px", fontWeight: "600" }))
const rowSub = cx(truncate, css({ fontSize: "13px", color: "textSecondary" }))
const rowMeta = cx(truncate, css({ fontSize: "12px", color: "textTertiary" }))
const rowDuration = css({
  display: "none",
  fontSize: "13px",
  color: "textTertiary",
  fontVariantNumeric: "tabular-nums",
  flexShrink: 0,
  md: { display: "block" },
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
const bannedBadge = cx(badge, css({ backgroundColor: "dangerSoft", color: "danger" }))

const actions = css({ display: "flex", gap: "8px", flexShrink: 0 })

const iconButton = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "32px",
  height: "32px",
  _touch: { width: "40px", height: "40px" },
  borderRadius: "full",
  border: "none",
  background: "none",
  color: "textSecondary",
  cursor: "pointer",
  flexShrink: 0,
  transition: "all token(durations.fast) token(easings.apple)",
  _hover: { color: "accent", backgroundColor: "accentSoft" },
})

const dangerIconButton = cx(
  iconButton,
  css({ _hover: { color: "danger !important", backgroundColor: "dangerSoft" } }),
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

const searchBox = css({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "12px 18px",
  borderRadius: "m",
  backgroundColor: "surfaceRaised",
  border: "1px solid token(colors.border)",
  marginBottom: "16px",
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
  fontSize: "16px",
  fontFamily: "sans",
  _placeholder: { color: "textTertiary" },
})

const syncFeedback = css({ fontSize: "13px", marginTop: "10px" })
const syncOk = css({ color: "accent" })
const syncError = css({ color: "danger" })

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

function MusicsSection() {
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search.trim())
  const { data, isPending } = useQuery({
    ...musicsQuery(page, PAGE_SIZE, debouncedSearch || undefined),
    placeholderData: keepPreviousData,
  })
  const syncMusics = useSyncMusics()
  const deleteMusic = useDeleteMusic()
  const editDialog = useDialog(MusicEditDialog)
  const confirmDialog = useDialog(ConfirmDialog)

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1

  const confirmDeleteMusic = async (music: Music) => {
    const confirmed = await confirmDialog.open({
      title: "Supprimer le titre ?",
      message: `« ${music.title} » sera définitivement supprimé de la bibliothèque et de toutes les playlists. Cette action est irréversible.`,
      confirmLabel: "Supprimer",
      danger: true,
    })
    if (confirmed) deleteMusic.mutate(music.id)
  }

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

      <div className={searchBox}>
        <SearchIcon size={18} />
        <input
          className={searchInput}
          placeholder="Rechercher un titre ou un artiste…"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value)
            setPage(0)
          }}
        />
      </div>

      {isPending && <div className={emptyState}>Chargement…</div>}
      {data && data.records.length === 0 && (
        <div className={emptyState}>
          {debouncedSearch
            ? `Aucun résultat pour « ${debouncedSearch} ».`
            : "Aucun titre dans la bibliothèque."}
        </div>
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
              onClick={() => editDialog.open({ music })}
              aria-label={`Modifier ${music.title}`}
              title="Modifier les métadonnées"
            >
              <EditIcon size={18} />
            </button>
            <button
              type="button"
              className={dangerIconButton}
              onClick={() => confirmDeleteMusic(music)}
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
  const confirmDialog = useDialog(ConfirmDialog)
  const currentUserId = getCurrentUser()?.sub

  const busy = banUser.isPending || unbanUser.isPending || deleteUser.isPending
  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1

  const confirmDeleteUser = async (user: User) => {
    const confirmed = await confirmDialog.open({
      title: "Supprimer l’utilisateur ?",
      message: `« ${user.name} » sera définitivement supprimé, ainsi que ses playlists. Cette action est irréversible.`,
      confirmLabel: "Supprimer",
      danger: true,
    })
    if (confirmed) deleteUser.mutate(user.id)
  }

  return (
    <div>
      <div className={sectionHeader}>
        <span className={sectionTitle}>Activer, désactiver ou supprimer des utilisateurs.</span>
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
                {!user.isActive && <span className={bannedBadge}>Inactif</span>}
              </div>
              <div className={rowSub}>{user.email}</div>
              <div className={rowMeta}>
                Inscrit le {formatDate(user.createdAt)} · Dernière activité{" "}
                {formatRelativeTime(user.lastActivityAt).toLowerCase()}
              </div>
            </div>
            <div className={actions}>
              {user.isActive ? (
                <Button
                  variant="ghost"
                  disabled={busy || isSelf}
                  title={isSelf ? "Vous ne pouvez pas vous désactiver" : undefined}
                  onClick={() => banUser.mutate(user.id)}
                >
                  Désactiver
                </Button>
              ) : (
                <Button variant="ghost" disabled={busy} onClick={() => unbanUser.mutate(user.id)}>
                  Activer
                </Button>
              )}
              <Button
                variant="danger"
                disabled={busy || isSelf}
                title={isSelf ? "Vous ne pouvez pas vous supprimer" : undefined}
                onClick={() => confirmDeleteUser(user)}
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
      throw redirect({ to: "/" })
    }
  },
})
