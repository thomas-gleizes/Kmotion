import { useEffect, useRef } from "react"
import { createRoute } from "@tanstack/react-router"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useDialog } from "react-dialog-promise"
import { css } from "styled-system/css"
import { appLayoutRoute } from "./app.layout"
import { musicsInfiniteQuery } from "../api/queries"
import { emptyState, pageHeading } from "../lib/styles"
import { usePlayer } from "../player/PlayerContext"
import { MusicCard } from "../components/MusicCard"
import { AddToPlaylistDialog } from "../components/dialogs/AddToPlaylistDialog"
import { SpinnerIcon } from "../components/icons"

const PAGE_SIZE = 30

const grid = css({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
  gap: "12px",
})

const sentinel = css({ height: "1px" })

const loadingMore = css({
  display: "flex",
  justifyContent: "center",
  padding: "24px",
  color: "textSecondary",
})

export const HomePage = () => {
  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    musicsInfiniteQuery(PAGE_SIZE),
  )
  const player = usePlayer()
  const addToPlaylist = useDialog(AddToPlaylistDialog)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const records = data?.pages.flatMap((page) => page.records) ?? []

  useEffect(() => {
    const target = sentinelRef.current
    if (!target) return

    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
        void fetchNextPage()
      }
    })
    observer.observe(target)
    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  return (
    <div>
      <h1 className={pageHeading}>Écouter</h1>
      {isPending && <div className={emptyState}>Chargement de la bibliothèque…</div>}
      {data && records.length === 0 && (
        <div className={emptyState}>
          Votre bibliothèque est vide. Ajoutez un titre depuis l’onglet « Ajouter ».
        </div>
      )}
      <div className={grid}>
        {records.map((music, i) => (
          <MusicCard
            key={music.id}
            music={music}
            onPlay={() => player.playQueue(records, i)}
            onAddToPlaylist={() => addToPlaylist.open({ music })}
          />
        ))}
      </div>
      <div ref={sentinelRef} className={sentinel} />
      {isFetchingNextPage && (
        <div className={loadingMore}>
          <SpinnerIcon size={20} />
        </div>
      )}
    </div>
  )
}

export const homeRoute = createRoute({
  path: "/",
  component: HomePage,
  getParentRoute: () => appLayoutRoute,
})
