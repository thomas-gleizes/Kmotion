import { useState } from "react"
import { type DialogComponent } from "react-dialog-promise"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { css } from "styled-system/css"
import { musicSearchQuery } from "@/features/music/api/music.queries"
import { useAddMusicToPlaylist } from "@/features/playlist/api/playlist.queries"
import { useDebounce } from "@/shared/hooks/useDebounce"
import { Modal } from "@/shared/ui/Modal"
import { Button } from "@/shared/ui/Button"
import { MusicRow } from "@/features/music/components/MusicRow"
import { CheckIcon, PlusIcon, SearchIcon } from "@/shared/ui/icons"

const searchBox = css({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "12px 18px",
  borderRadius: "m",
  backgroundColor: "surfaceRaised",
  border: "1px solid token(colors.border)",
  marginBottom: "12px",
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

const list = css({
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  maxHeight: "360px",
  overflowY: "auto",
})

const emptyStyle = css({ color: "textSecondary", fontSize: "14px", padding: "12px 0" })

const toggleButton = css({
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

const inPlaylist = css({ color: "success", _hover: { color: "success" } })
const selected = css({ color: "accent" })

const footer = css({
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  marginTop: "16px",
})

export const AddMusicsToPlaylistDialog: DialogComponent<
  { playlistId: string; existingIds: string[] },
  void
> = ({ isOpen, close, playlistId, existingIds }) => {
  const [input, setInput] = useState("")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const query = useDebounce(input.trim())
  const addMusic = useAddMusicToPlaylist()

  const existing = new Set(existingIds)

  const { data: results, isFetching } = useQuery({
    ...musicSearchQuery(query),
    enabled: query.length > 1,
    placeholderData: keepPreviousData,
  })

  const toggle = (id: string) => {
    if (existing.has(id)) return
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]))
  }

  const onValidate = async () => {
    let position = existingIds.length + 1
    for (const musicId of selectedIds) {
      await addMusic.mutateAsync({ playlistId, musicId, position })
      position += 1
    }
    close()
  }

  return (
    <Modal title="Ajouter des titres" open={isOpen} onClose={() => close()}>
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

      {query.length <= 1 && <p className={emptyStyle}>Recherchez des titres à ajouter.</p>}
      {query.length > 1 && results?.length === 0 && !isFetching && (
        <p className={emptyStyle}>Aucun résultat pour « {query} ».</p>
      )}

      <div className={list}>
        {results?.map((music) => {
          const isInPlaylist = existing.has(music.id)
          const isSelected = selectedIds.includes(music.id)
          return (
            <MusicRow
              key={music.id}
              id={music.id}
              title={music.title}
              artist={music.artist}
              duration={music.duration}
              onPlay={() => toggle(music.id)}
              actions={
                <button
                  type="button"
                  className={`${toggleButton} ${isInPlaylist ? inPlaylist : isSelected ? selected : ""}`}
                  disabled={isInPlaylist}
                  onClick={() => toggle(music.id)}
                  aria-label={
                    isInPlaylist
                      ? "Déjà dans la playlist"
                      : isSelected
                        ? "Retirer de la sélection"
                        : "Sélectionner"
                  }
                >
                  {isInPlaylist || isSelected ? <CheckIcon size={18} /> : <PlusIcon size={18} />}
                </button>
              }
            />
          )
        })}
      </div>

      <div className={footer}>
        <Button variant="ghost" onClick={() => close()}>
          Annuler
        </Button>
        <Button onClick={onValidate} disabled={selectedIds.length === 0 || addMusic.isPending}>
          Ajouter{selectedIds.length > 0 ? ` (${selectedIds.length})` : ""}
        </Button>
      </div>
    </Modal>
  )
}
