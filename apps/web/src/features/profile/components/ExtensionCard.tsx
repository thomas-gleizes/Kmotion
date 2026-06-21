import { DownloadIcon } from "@/shared/ui/icons"
import { downloadButton, extensionCard, extensionText } from "@/features/profile/profile.styles"

// Carte de téléchargement de l'extension navigateur (archive servie en statique).
export function ExtensionCard() {
  return (
    <div className={extensionCard}>
      <p className={extensionText}>
        Installez l’extension kMotion pour convertir et enregistrer des vidéos YouTube en MP3
        directement depuis votre navigateur. Téléchargez l’archive puis chargez-la dans la page des
        extensions de votre navigateur.
      </p>
      <a className={downloadButton} href="/downloads/kmotion-extension.zip" download>
        <DownloadIcon size={18} /> Télécharger l’extension
      </a>
    </div>
  )
}
