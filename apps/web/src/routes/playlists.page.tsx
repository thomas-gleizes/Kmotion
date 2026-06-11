import { createRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { useDialog } from "react-dialog-promise"
import { css, cx } from "styled-system/css"
import { appLayoutRoute } from "./app.layout"
import { playlistsQuery, useCreatePlaylist } from "../api/queries"
import { PlaylistCard } from "../components/PlaylistCard"
import { PlaylistFormDialog } from "../components/dialogs/PlaylistFormDialog"
import { Button } from "../components/Button"
import { PlusIcon } from "../components/icons"
import { emptyState, pageHeading } from "../lib/styles"

const header = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: "12px",
  marginBottom: "24px",
})

const grid = css({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
  gap: "10px",
  md: { gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px" },
})

export const PlaylistsPage = () => {
  const { data: playlists, isPending } = useQuery(playlistsQuery)
  const createPlaylist = useCreatePlaylist()
  const createDialog = useDialog(PlaylistFormDialog)

  const openCreate = () =>
    createDialog.open({
      heading: "Nouvelle playlist",
      submitLabel: "Créer",
      onSubmit: (values) => createPlaylist.mutateAsync(values),
    })

  return (
    <div>
      <div className={header}>
        <h1 className={cx(pageHeading, css({ marginBottom: 0 }))}>Playlists</h1>
        <Button onClick={openCreate}>
          <PlusIcon size={16} /> Nouvelle playlist
        </Button>
      </div>

      {isPending && <div className={emptyState}>Chargement…</div>}
      {playlists?.length === 0 && (
        <div className={emptyState}>Aucune playlist pour le moment. Créez la première !</div>
      )}
      <div className={grid}>
        {playlists?.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
      </div>
    </div>
  )
}

export const playlistsRoute = createRoute({
  path: "/playlists",
  component: PlaylistsPage,
  getParentRoute: () => appLayoutRoute,
})
