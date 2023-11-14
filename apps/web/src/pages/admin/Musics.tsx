import { useMutation } from "@tanstack/react-query"
import { api } from "../../utils/Api"
import { toast } from "react-toastify"
import { s } from "../../utils/helpers"
import React from "react"

const AdminMusics: Page = () => {
  const syncMutation = useMutation({
    mutationKey: ["sync-musics"],
    mutationFn: () => api.synchronizeMusic(),
    onSuccess: (resp) => {
      if (resp.musics.length === 0) return toast.info("Aucune nouvelle music")
      else
        toast.info(
          `${resp.musics.length} nouvelle${s(resp.musics.length)} music${s(
            resp.musics.length,
          )} synchronisé !`,
        )
    },
  })

  return (
    <div>
      <h1 className="text-center">admin musics page</h1>
      <button
        className="btn bg-blue-800 text-white hover:bg-blue-900 disabled:bg-blue-600"
        onClick={() => syncMutation.mutate()}
        disabled={syncMutation.isLoading}
      >
        sync musics
      </button>
    </div>
  )
}

export default AdminMusics
