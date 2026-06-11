import { useState } from "react"
import { createRoute } from "@tanstack/react-router"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { css } from "styled-system/css"
import { appLayoutRoute } from "./app.layout"
import { musicsQuery, type Music } from "../api/queries"
import { emptyState, pageHeading } from "../lib/styles"
import { usePlayer } from "../player/PlayerContext"
import { MusicCard } from "../components/MusicCard"
import { AddToPlaylistModal } from "../components/AddToPlaylistModal"
import { Button } from "../components/Button"

const PAGE_SIZE = 30

const grid = css({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
  gap: "12px",
})

const pager = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "16px",
  marginTop: "28px",
  color: "textSecondary",
  fontSize: "14px",
})

export const HomePage = () => {
  const { page } = homeRoute.useSearch()
  const navigate = homeRoute.useNavigate()
  const { data, isPending } = useQuery({
    ...musicsQuery(page - 1, PAGE_SIZE),
    placeholderData: keepPreviousData,
  })
  const player = usePlayer()
  const [musicToAdd, setMusicToAdd] = useState<Music | null>(null)

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1

  const goToPage = (next: number) =>
    navigate({ search: (prev) => ({ ...prev, page: next }) })

  return (
    <div>
      <h1 className={pageHeading}>Écouter</h1>
      {isPending && <div className={emptyState}>Chargement de la bibliothèque…</div>}
      {data && data.records.length === 0 && (
        <div className={emptyState}>
          Votre bibliothèque est vide. Ajoutez un titre depuis l’onglet « Ajouter ».
        </div>
      )}
      <div className={grid}>
        {data?.records.map((music, i) => (
          <MusicCard
            key={music.id}
            music={music}
            onPlay={() => player.playQueue(data.records, i)}
            onAddToPlaylist={() => setMusicToAdd(music)}
          />
        ))}
      </div>
      {data && data.total > PAGE_SIZE && (
        <div className={pager}>
          <Button variant="ghost" disabled={page <= 1} onClick={() => goToPage(page - 1)}>
            Précédent
          </Button>
          <span>
            Page {page} / {totalPages}
          </span>
          <Button variant="ghost" disabled={page >= totalPages} onClick={() => goToPage(page + 1)}>
            Suivant
          </Button>
        </div>
      )}
      {musicToAdd && <AddToPlaylistModal music={musicToAdd} onClose={() => setMusicToAdd(null)} />}
    </div>
  )
}

type HomeSearch = {
  page: number
}

export const homeRoute = createRoute({
  path: "/",
  component: HomePage,
  getParentRoute: () => appLayoutRoute,
  validateSearch: (search: Record<string, unknown>): HomeSearch => {
    const page = Number(search.page)
    return { page: Number.isInteger(page) && page >= 1 ? page : 1 }
  },
})
