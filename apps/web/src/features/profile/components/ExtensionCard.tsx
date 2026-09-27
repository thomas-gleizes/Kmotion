import { useMutation } from "@tanstack/react-query"
import { authedFetch } from "@/shared/api/client"
import { DownloadIcon } from "@/shared/ui/icons"
import {
  downloadButton,
  downloadError,
  extensionCard,
  extensionText,
} from "@/features/profile/profile.styles"

const ARCHIVE_NAME = "kmotion-extension.zip"

// Enregistre un Blob sur le poste via un lien temporaire.
function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

// Carte de téléchargement de l'extension navigateur. L'archive est déposée par
// la CI dans le stockage objet ; le backend la relaie, authentifiée.
export function ExtensionCard() {
  const download = useMutation({
    mutationFn: () => authedFetch("/api/3.1/extension/download"),
    onSuccess: (blob) => saveBlob(blob, ARCHIVE_NAME),
  })

  return (
    <div className={extensionCard}>
      <p className={extensionText}>
        Installez l’extension kMotion pour convertir et enregistrer des vidéos YouTube en MP3
        directement depuis votre navigateur. Téléchargez l’archive puis chargez-la dans la page des
        extensions de votre navigateur.
      </p>
      <button
        type="button"
        className={downloadButton}
        onClick={() => download.mutate()}
        disabled={download.isPending}
      >
        <DownloadIcon size={18} />{" "}
        {download.isPending ? "Téléchargement…" : "Télécharger l’extension"}
      </button>
      {download.isError && (
        <p className={downloadError}>Impossible de télécharger l’extension, réessayez plus tard.</p>
      )}
    </div>
  )
}
