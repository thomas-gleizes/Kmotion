import { useState } from "react"
import { createRoute } from "@tanstack/react-router"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useDialog } from "react-dialog-promise"
import { css } from "styled-system/css"
import { appLayoutRoute } from "@/app/routes/app.layout"
import { musicSearchQuery } from "@/features/music/api/music.queries"
import { usePlayer } from "@/features/player/state/PlayerContext"
import { MusicRow } from "@/features/music/components/MusicRow"
import { AddToPlaylistDialog } from "@/features/playlist/components/dialogs/AddToPlaylistDialog"
import { PlusIcon, SearchIcon } from "@/shared/ui/icons"
import { useDebounce } from "@/shared/hooks/useDebounce"
import { emptyState, pageHeading } from "@/shared/lib/styles"

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

export const SearchPage = () => {
  const [input, setInput] = useState("")
  const query = useDebounce(input.trim())
  const player = usePlayer()
  const addToPlaylist = useDialog(AddToPlaylistDialog)

  const { data: results, isFetching } = useQuery({
    ...musicSearchQuery(query),
    enabled: query.length > 1,
    placeholderData: keepPreviousData,
  })

  return (
    <div>
      <h1 className={pageHeading}>Rechercher</h1>
      <div className={searchBox}>
        <SearchIcon size={18} />
        <input
          className={searchInput}
          placeholder="Titres, artistes…"
          autoFocus
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
      </div>

      {query.length <= 1 && <div className={emptyState}>Recherchez dans votre bibliothèque.</div>}
      {query.length > 1 && results?.length === 0 && !isFetching && (
        <div className={emptyState}>Aucun résultat pour « {query} ».</div>
      )}
      {results?.map((music, i) => (
        <MusicRow
          key={music.id}
          id={music.id}
          title={music.title}
          artist={music.artist}
          duration={music.duration}
          onPlay={() => player.playQueue(results, i)}
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
    </div>
  )
}

export const searchRoute = createRoute({
  path: "/search",
  component: SearchPage,
  getParentRoute: () => appLayoutRoute,
})
