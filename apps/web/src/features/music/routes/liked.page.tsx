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
import { AddToPlaylistDialog } from "@/features/playlist/components/dialogs/AddToPlaylistDialog"
import { ChevronDownIcon, ChevronUpIcon, SpinnerIcon } from "@/shared/ui/icons"

const PAGE_SIZE = 30

const SORT_OPTIONS: { value: MusicSort; label: string }[] = [
  { value: "createdAt", label: "Date d’ajout" },
  { value: "title", label: "Titre" },
  { value: "artist", label: "Artiste" },
  { value: "duration", label: "Durée" },
]

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

const controls = css({
  display: "flex",
  alignItems: "center",
  gap: "8px",
})

const select = css({
  appearance: "none",
  padding: "8px 14px",
  borderRadius: "m",
  backgroundColor: "surfaceRaised",
  border: "1px solid token(colors.border)",
  color: "text",
  fontSize: "14px",
  fontFamily: "sans",
  cursor: "pointer",
  outline: "none",
  transition: "all token(durations.fast) token(easings.apple)",
  _focusVisible: { borderColor: "accent", boxShadow: "0 0 0 3px token(colors.accentGlow)" },
})

const directionButton = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "36px",
  height: "36px",
  borderRadius: "m",
  backgroundColor: "surfaceRaised",
  border: "1px solid token(colors.border)",
  color: "textSecondary",
  cursor: "pointer",
  transition: "all token(durations.fast) token(easings.apple)",
  _hover: { color: "accent", borderColor: "accent" },
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
        <div className={controls}>
          <select
            className={select}
            value={sort}
            onChange={(e) => setSort(e.target.value as MusicSort)}
            aria-label="Trier par"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            className={directionButton}
            onClick={toggleOrder}
            aria-label={order === "asc" ? "Ordre croissant" : "Ordre décroissant"}
            title={order === "asc" ? "Ordre croissant" : "Ordre décroissant"}
          >
            {order === "asc" ? <ChevronUpIcon size={18} /> : <ChevronDownIcon size={18} />}
          </button>
        </div>
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
