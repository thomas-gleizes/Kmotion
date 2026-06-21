import { useState } from "react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useDialog } from "react-dialog-promise"
import { getCurrentUser } from "@/features/auth/auth"
import { usersQuery, useBanUser, useUnbanUser, useDeleteUser } from "@/features/admin/api/admin.queries"
import type { User } from "@/shared/api/types"
import { formatDate, formatRelativeTime } from "@/shared/lib/format"
import { emptyState } from "@/shared/lib/styles"
import { Button } from "@/shared/ui/Button"
import { ConfirmDialog } from "@/shared/ui/dialogs/ConfirmDialog"
import {
  actions,
  adminBadge,
  bannedBadge,
  cellMain,
  row,
  rowMeta,
  rowSub,
  rowTitle,
  sectionHeader,
  sectionTitle,
} from "@/features/admin/admin.styles"
import { Pager } from "./Pager"

const PAGE_SIZE = 30

export function UsersSection() {
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
