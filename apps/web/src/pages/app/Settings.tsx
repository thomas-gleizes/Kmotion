import React, { useMemo, useState } from "react"
import { useRouter } from "@tanstack/react-router"

import { api } from "../../utils/Api"
import { isChromeDesktop, saveBlob } from "../../utils/helpers"
import { useAuthenticatedContext } from "../../contexts/auth"
import ScrollableLayout from "../../components/layouts/ScrollableLayout"

const Settings: Page = () => {
  const { history } = useRouter()
  const { logout } = useAuthenticatedContext()

  const [loading, setLoading] = useState<boolean>(false)

  const handleDisconnect = () => {
    history.push("/", null)
    logout()
  }

  const handleDownloadExtension = async () => {
    setLoading(true)
    const blob = await api.downloadExtension().blob()

    saveBlob(blob, "kmotion.zip")
    setLoading(false)
  }

  const displayDownloadExtensionButton = useMemo(() => isChromeDesktop(), [])

  return (
    <ScrollableLayout>
      <div className="m-3">
        <h1 className="text-center text-white pt-3">Settings</h1>
        <div className="flex flex-wrap space-x-2 my-5">
          <button
            className="btn bg-blue-800 text-white hover:bg-blue-900 disabled:bg-blue-600"
            onClick={handleDisconnect}
            disabled={loading}
          >
            Disconnect
          </button>
          {displayDownloadExtensionButton && (
            <button
              className="btn bg-blue-800 text-white hover:bg-blue-900 disabled:bg-blue-600"
              onClick={handleDownloadExtension}
              disabled={loading}
            >
              Télécharger l'extension
            </button>
          )}
        </div>
      </div>
    </ScrollableLayout>
  )
}

export default Settings
