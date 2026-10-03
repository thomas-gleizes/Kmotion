import { useEffect, useRef } from "react"
import { createRoute } from "@tanstack/react-router"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useDialog } from "react-dialog-promise"
import { css } from "styled-system/css"
import { appLayoutRoute } from "@/app/routes/app.layout"
import { musicsInfiniteQuery, type MusicSort } from "@/features/music/api/music.queries"
import { emptyState } from "@/shared/lib/styles"
import { useSortPreference } from "@/features/music/hooks/useSortPreference"
import { usePlayer } from "@/features/player/state/PlayerContext"
import { MusicCard } from "@/features/music/components/MusicCard"
import { SortControls } from "@/features/music/components/SortControls"
import { AddToPlaylistDialog } from "@/features/playlist/components/dialogs/AddToPlaylistDialog"
import { SpinnerIcon } from "@/shared/ui/icons"

const PAGE_SIZE = 30

const SORT_OPTIONS: MusicSort[] = ["createdAt", "title", "artist", "duration"]

const grid = css({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
  gap: "10px",
  md: { gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: "12px" },
})

const sentinel = css({ height: "1px" })

const toolbar = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  marginBottom: "20px",
  md: { marginBottom: "24px" },
})

const heading = css({
  fontSize: "26px",
  fontWeight: "800",
  letterSpacing: "-0.8px",
  md: { fontSize: "32px" },
})

const loadingMore = css({
  display: "flex",
  justifyContent: "center",
  padding: "24px",
  color: "textSecondary",
})

export const LikedPage = () => {
  const [{ sort, order }, setSort, toggleOrder] = useSortPreference("liked:sort", {
    sort: "createdAt",
    order: "desc",
  })
  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    musicsInfiniteQuery(PAGE_SIZE, sort, order, true),
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
      <div className={toolbar}>
        <h1 className={heading}>Titres likés</h1>
        <SortControls
          options={SORT_OPTIONS}
          sort={sort}
          order={order}
          onSortChange={setSort}
          onToggleOrder={toggleOrder}
        />
      </div>
      {isPending && <div className={emptyState}>Chargement…</div>}
      {data && records.length === 0 && (
        <div className={emptyState}>
          Vous n’avez encore aucun titre liké. Cliquez sur le cœur d’un titre pour l’ajouter ici.
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

export const likedRoute = createRoute({
  path: "/liked",
  component: LikedPage,
  getParentRoute: () => appLayoutRoute,
})
