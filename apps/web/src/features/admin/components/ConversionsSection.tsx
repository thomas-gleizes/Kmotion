import { useQuery } from "@tanstack/react-query"
import { useDialog } from "react-dialog-promise"
import { cx } from "styled-system/css"
import {
  conversionsQuery,
  useDeleteMusic,
  useRetryConversion,
} from "@/features/music/api/music.queries"
import type { Music } from "@/shared/api/types"
import { formatRelativeTime } from "@/shared/lib/format"
import { emptyState } from "@/shared/lib/styles"
import { ConfirmDialog } from "@/shared/ui/dialogs/ConfirmDialog"
import { SpinnerIcon, SyncIcon, TrashIcon } from "@/shared/ui/icons"
import {
  actions,
  cellMain,
  dangerIconButton,
  errorReason,
  failedBadge,
  iconButton,
  processingBadge,
  queuedBadge,
  row,
  rowMeta,
  rowSub,
  rowTitle,
  sectionHeader,
  sectionTitle,
  syncError,
  syncFeedback,
} from "@/features/admin/admin.styles"

// Les erreurs métier du serveur portent leur explication dans `message`.
function retryErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) {
    const { message } = error as { message: unknown }
    if (typeof message === "string" && message) return message
  }
  return "La relance a échoué."
}

function StatusBadge({ status }: { status: Music["conversionStatus"] }) {
  if (status === "processing") {
    return (
      <span className={processingBadge}>
        <SpinnerIcon size={12} />
        Conversion en cours
      </span>
    )
  }
  if (status === "failed") return <span className={failedBadge}>Échouée</span>
  return <span className={queuedBadge}>En file d'attente</span>
}

export function ConversionsSection() {
  const { data, isPending, isError } = useQuery(conversionsQuery())
  const deleteMusic = useDeleteMusic()
  const retryConversion = useRetryConversion()
  const confirmDialog = useDialog(ConfirmDialog)

  const confirmDeleteMusic = async (music: Music) => {
    const confirmed = await confirmDialog.open({
      title: "Supprimer la conversion ?",
      message: `« ${music.title} » sera retiré de la bibliothèque : la vidéo pourra être convertie à nouveau.`,
      confirmLabel: "Supprimer",
      danger: true,
    })
    if (confirmed) deleteMusic.mutate(music.id)
  }

  return (
    <div>
      <div className={sectionHeader}>
        <span className={sectionTitle}>
          Conversions en file d'attente, en cours ou échouées, de la plus ancienne à la plus
          récente.
        </span>
      </div>

      {isPending && <div className={emptyState}>Chargement…</div>}
      {isError && <div className={emptyState}>Impossible de charger les conversions.</div>}
      {data && data.length === 0 && <div className={emptyState}>Aucune conversion en cours.</div>}

      {data?.map((music) => (
        <div key={music.id} className={row}>
          <div className={cellMain}>
            <div className={rowTitle}>{music.title}</div>
            <div className={rowSub}>{music.artist}</div>
            <div className={rowMeta}>Ajouté {formatRelativeTime(music.createdAt)}</div>
            {music.conversionStatus === "failed" && (
              <div className={errorReason} title={music.conversionError ?? undefined}>
                {music.conversionError ?? "Raison inconnue"}
              </div>
            )}
            {retryConversion.isError && retryConversion.variables === music.id && (
              <div className={cx(syncFeedback, syncError)}>
                {retryErrorMessage(retryConversion.error)}
              </div>
            )}
          </div>
          <StatusBadge status={music.conversionStatus} />
          <div className={actions}>
            {music.conversionStatus === "failed" && (
              <button
                type="button"
                className={iconButton}
                disabled={retryConversion.isPending}
                onClick={() => retryConversion.mutate(music.id)}
                aria-label={`Relancer ${music.title}`}
                title="Relancer la conversion"
              >
                {retryConversion.isPending && retryConversion.variables === music.id ? (
                  <SpinnerIcon size={18} />
                ) : (
                  <SyncIcon size={18} />
                )}
              </button>
            )}
            {music.conversionStatus === "failed" && (
              <button
                type="button"
                className={dangerIconButton}
                onClick={() => confirmDeleteMusic(music)}
                aria-label={`Supprimer ${music.title}`}
                title="Supprimer pour pouvoir relancer la conversion"
              >
                <TrashIcon size={18} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
