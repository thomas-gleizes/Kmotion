import { useEffect, useRef, useState } from "react"
import { createRoute } from "@tanstack/react-router"
import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { useDialog } from "react-dialog-promise"
import { css } from "styled-system/css"
import { appLayoutRoute } from "@/app/routes/app.layout"
import {
  musicsInfiniteQuery,
  musicSearchQuery,
  type MusicSort,
} from "@/features/music/api/music.queries"
import { emptyState } from "@/shared/lib/styles"
import { useDebounce } from "@/shared/hooks/useDebounce"
import { useSortPreference } from "@/features/music/hooks/useSortPreference"
import { usePlayer } from "@/features/player/state/PlayerContext"
import { MusicCard } from "@/features/music/components/MusicCard"
import { MusicRow } from "@/features/music/components/MusicRow"
import { AddToPlaylistDialog } from "@/features/playlist/components/dialogs/AddToPlaylistDialog"
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  SearchIcon,
  ShuffleIcon,
  SpinnerIcon,
} from "@/shared/ui/icons"

const PAGE_SIZE = 30

const SORT_OPTIONS: { value: MusicSort; label: string }[] = [
  { value: "createdAt", label: "Date d’ajout" },
  { value: "title", label: "Titre" },
  { value: "artist", label: "Artiste" },
  { value: "duration", label: "Durée" },
  { value: "favorite", label: "Favoris" },
  { value: "random", label: "Aléatoire" },
]

const newSeed = () => Math.random().toString(36).slice(2)

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

const searchBox = css({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "12px 18px",
  borderRadius: "m",
  backgroundColor: "surfaceRaised",
  border: "1px solid token(colors.border)",
  marginBottom: "20px",
  color: "textSecondary",
  transition: "all token(durations.fast) token(easings.apple)",
  _focusWithin: { borderColor: "accent", boxShadow: "0 0 0 3px token(colors.accentGlow)" },
})

const searchInput = css({
  flex: 1,
  background: "none",
  border: "none",
  outline: "none",
  color: "text",
  fontSize: "16px",
  fontFamily: "sans",
  _placeholder: { color: "textTertiary" },
})

const addButton = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "32px",
  height: "32px",
  borderRadius: "full",
  border: "none",
  background: "none",
  color: "textSecondary",
  cursor: "pointer",
  transition: "all token(durations.fast) token(easings.apple)",
  _hover: { color: "accent", backgroundColor: "accentSoft" },
})

export const HomePage = () => {
  const [{ sort, order }, setSort, toggleOrder] = useSortPreference("music:sort", {
    sort: "createdAt",
    order: "desc",
  })
  const [seed, setSeed] = useState(newSeed)
  const isRandom = sort === "random"

  const handleSortChange = (value: MusicSort) => {
    if (value === "random") setSeed(newSeed())
    setSort(value)
  }

  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    musicsInfiniteQuery(PAGE_SIZE, sort, order, undefined, isRandom ? seed : undefined),
  )
  const player = usePlayer()
  const addToPlaylist = useDialog(AddToPlaylistDialog)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const [input, setInput] = useState("")
  const query = useDebounce(input.trim())
  const isSearching = query.length > 1

  const { data: searchResults, isFetching: isSearchFetching } = useQuery({
    ...musicSearchQuery(query),
    enabled: isSearching,
    placeholderData: keepPreviousData,
  })

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
        <h1 className={heading}>Écouter</h1>
        <div className={controls}>
          <select
            className={select}
            value={sort}
            onChange={(e) => handleSortChange(e.target.value as MusicSort)}
            aria-label="Trier par"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {isRandom ? (
            <button
              type="button"
              className={directionButton}
              onClick={() => setSeed(newSeed())}
              aria-label="Mélanger à nouveau"
              title="Mélanger à nouveau"
            >
              <ShuffleIcon size={18} />
            </button>
          ) : (
            <button
              type="button"
              className={directionButton}
              onClick={toggleOrder}
              aria-label={order === "asc" ? "Ordre croissant" : "Ordre décroissant"}
              title={order === "asc" ? "Ordre croissant" : "Ordre décroissant"}
            >
              {order === "asc" ? <ChevronUpIcon size={18} /> : <ChevronDownIcon size={18} />}
            </button>
          )}
        </div>
      </div>
      <div className={searchBox}>
        <SearchIcon size={18} />
        <input
          className={searchInput}
          placeholder="Titres, artistes…"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
      </div>
      {isSearching ? (
        <>
          {searchResults?.length === 0 && !isSearchFetching && (
            <div className={emptyState}>Aucun résultat pour « {query} ».</div>
          )}
          {searchResults?.map((music, i) => (
            <MusicRow
              key={music.id}
              id={music.id}
              title={music.title}
              artist={music.artist}
              duration={music.duration}
              onPlay={() => player.playQueue(searchResults, i)}
              actions={
                <button
                  type="button"
                  className={addButton}
                  onClick={() => addToPlaylist.open({ music })}
                  aria-label="Ajouter à une playlist"
                >
                  <PlusIcon size={18} />
                </button>
              }
            />
          ))}
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  )
}

export const homeRoute = createRoute({
  path: "/",
  component: HomePage,
  getParentRoute: () => appLayoutRoute,
})
