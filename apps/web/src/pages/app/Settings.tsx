import React, { useMemo } from "react"
import { useRouter } from "@tanstack/react-router"

import ScrollableLayout from "../../components/layouts/ScrollableLayout"
import { useAuthenticatedContext } from "../../contexts/auth"
import { api } from "../../utils/Api"
import { isChromeDesktop, saveBlob } from "../../utils/helpers"

const Settings: Page = () => {
  const { history } = useRouter()
  const { user, logout } = useAuthenticatedContext()

  const handleDisconnect = () => {
    history.push("/", null)
    logout()
  }

  const handleDownloadExtension = async () => {
    const blob = await api.downloadExtension().blob()

    saveBlob(blob, "kmotion.zip")
  }

  const displayDownloadExtensionButton = useMemo(() => isChromeDesktop(), [])

  return (
    <ScrollableLayout>
      <h1 className="text-center text-white pt-3">Settings</h1>
      <div className="flex flex-wrap space-x-2 my-5">
        <button className="btn bg-blue-400 text-black" onClick={handleDisconnect}>
          Disconnect
        </button>
        {displayDownloadExtensionButton && (
          <button className="btn bg-blue-400 text-black" onClick={handleDownloadExtension}>
            Télécharger l'extension
          </button>
        )}
        {user.isAdmin && (
          <button
            className="btn bg-blue-400 text-black"
            onClick={() => {
              fetch("/api/v1/musics/sync")
                .then((response) => response.json())
                .then(console.log)
                .catch(console.error)
            }}
          >
            sync
          </button>
        )}
      </div>
    </ScrollableLayout>
  )
}

export default Settings
