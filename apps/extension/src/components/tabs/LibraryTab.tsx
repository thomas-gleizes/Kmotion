import React, { useCallback, useEffect, useState } from "react"
import { FiLoader, FiMusic, FiAlertCircle } from "react-icons/fi"
import { api, type Music } from "../../utils/api"
import { MusicItem } from "../MusicItem"
import { EmptyState } from "../EmptyState"
import { Loader } from "../Loader"
import { Button } from "../Button"

const PAGE_SIZE = 20

export const LibraryTab: React.FC = () => {
  const [records, setRecords] = useState<Music[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadPage = useCallback(async (nextPage: number) => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getMusics(nextPage, PAGE_SIZE)
      setTotal(data.total)
      setRecords((prev) => (nextPage === 0 ? data.records : [...prev, ...data.records]))
      setPage(nextPage)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de charger les musiques")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadPage(0)
  }, [loadPage])

  if (loading && records.length === 0) {
    return <Loader text="Chargement…" />
  }

  if (error && records.length === 0) {
    return (
      <EmptyState
        icon={<FiAlertCircle size={40} />}
        title="Erreur de chargement"
        message={error}
      >
        <Button onClick={() => loadPage(0)} className="text-sm px-5 py-2">
          Réessayer
        </Button>
      </EmptyState>
    )
  }

  if (total === 0) {
    return (
      <EmptyState
        icon={<FiMusic size={40} />}
        title="Aucune musique"
        message="Convertissez une vidéo YouTube pour la retrouver ici."
      />
    )
  }

  const hasMore = records.length < total

  return (
    <div className="py-2">
      <ul className="space-y-0.5">
        {records.map((music) => (
          <MusicItem key={music.id} music={music} />
        ))}
      </ul>

      {hasMore && (
        <div className="px-4 py-3">
          <button
            onClick={() => loadPage(page + 1)}
            disabled={loading}
            className="w-full text-sm font-medium text-ink-secondary hover:text-ink bg-surface hover:bg-surface-raised border border-hairline rounded-full py-2 transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading && <FiLoader className="animate-spin" size={14} />}
            {loading ? "Chargement…" : "Charger plus"}
          </button>
        </div>
      )}
    </div>
  )
}
