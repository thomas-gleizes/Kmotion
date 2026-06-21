import { useState } from "react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useDialog } from "react-dialog-promise"
import { cx } from "styled-system/css"
import { musicsQuery, useSyncMusics, useDeleteMusic } from "@/features/music/api/music.queries"
import type { Music } from "@/shared/api/types"
import { formatDuration } from "@/shared/lib/format"
import { emptyState } from "@/shared/lib/styles"
import { Button } from "@/shared/ui/Button"
import { MusicEditDialog } from "@/features/music/components/dialogs/MusicEditDialog"
import { ConfirmDialog } from "@/shared/ui/dialogs/ConfirmDialog"
import { useDebounce } from "@/shared/hooks/useDebounce"
import { EditIcon, SearchIcon, SpinnerIcon, SyncIcon, TrashIcon } from "@/shared/ui/icons"
import {
  actions,
  cellMain,
  dangerIconButton,
  iconButton,
  row,
  rowDuration,
  rowSub,
  rowTitle,
  searchBox,
  searchInput,
  sectionHeader,
  sectionTitle,
  syncError,
  syncFeedback,
  syncOk,
} from "@/features/admin/admin.styles"
import { Pager } from "./Pager"

const PAGE_SIZE = 30

export function MusicsSection() {
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
