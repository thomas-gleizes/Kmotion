import { type DialogComponent } from "react-dialog-promise"
import { useQuery } from "@tanstack/react-query"
import { css } from "styled-system/css"
import { playlistsQuery, useAddMusicToPlaylist, type Music } from "../../api/queries"
import { Modal } from "../Modal"
import { PlaylistMosaic } from "../PlaylistCard"

const list = css({ display: "flex", flexDirection: "column", gap: "4px" })

const item = css({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "8px 10px",
  borderRadius: "s",
  cursor: "pointer",
  background: "none",
  border: "none",
  color: "text",
  fontFamily: "sans",
  textAlign: "left",
  width: "100%",
  transition: "background token(durations.fast) token(easings.apple)",
  _hover: { backgroundColor: "rgba(255, 255, 255, 0.07)" },
  _disabled: { opacity: 0.5, cursor: "default" },
})

const mosaicSize = css({ width: "44px", flexShrink: 0 })
const emptyStyle = css({ color: "textSecondary", fontSize: "14px", padding: "8px 0" })
const subText = css({ color: "textSecondary", fontSize: "12px", display: "block" })

export const AddToPlaylistDialog: DialogComponent<{ music: Music }, void> = ({
  isOpen,
  close,
  music,
}) => {
  const { data: playlists } = useQuery(playlistsQuery)
  const addMusic = useAddMusicToPlaylist()

  return (
    <Modal title={`Ajouter « ${music.title} »`} open={isOpen} onClose={() => close()}>
      {playlists?.length === 0 && (
        <p className={emptyStyle}>Aucune playlist. Créez-en une depuis l’onglet Playlists.</p>
      )}
      <div className={list}>
        {playlists?.map((playlist) => (
          <button
            key={playlist.id}
            type="button"
            className={item}
            disabled={addMusic.isPending}
            onClick={() =>
              addMusic.mutate(
                {
                  playlistId: playlist.id,
                  musicId: music.id,
                  position: playlist.entriesTotal + 1,
                },
                { onSuccess: () => close() },
              )
            }
          >
            <span className={mosaicSize}>
              <PlaylistMosaic thumbnails={playlist.thumbnails} />
            </span>
            <span>
              {playlist.title}
              <span className={subText}>
                {playlist.entriesTotal} titre{playlist.entriesTotal > 1 ? "s" : ""}
              </span>
            </span>
          </button>
        ))}
      </div>
    </Modal>
  )
}
