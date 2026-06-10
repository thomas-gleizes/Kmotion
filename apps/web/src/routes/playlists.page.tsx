import { useState } from "react"
import { createRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { css, cx } from "styled-system/css"
import { appLayoutRoute } from "./app.layout"
import { playlistsQuery, useCreatePlaylist } from "../api/queries"
import { PlaylistCard } from "../components/PlaylistCard"
import { PlaylistForm } from "../components/PlaylistForm"
import { Button } from "../components/Button"
import { Modal } from "../components/Modal"
import { PlusIcon } from "../components/icons"
import { emptyState, pageHeading } from "../lib/styles"

const header = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "24px",
})

const grid = css({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
  gap: "12px",
})

export const PlaylistsPage = () => {
  const { data: playlists, isPending } = useQuery(playlistsQuery)
  const [showCreate, setShowCreate] = useState(false)
  const createPlaylist = useCreatePlaylist()

  return (
    <div>
      <div className={header}>
        <h1 className={cx(pageHeading, css({ marginBottom: 0 }))}>Playlists</h1>
        <Button onClick={() => setShowCreate(true)}>
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

      {showCreate && (
        <Modal title="Nouvelle playlist" onClose={() => setShowCreate(false)}>
          <PlaylistForm
            pending={createPlaylist.isPending}
            submitLabel="Créer"
            onSubmit={(values) =>
              createPlaylist.mutate(values, { onSuccess: () => setShowCreate(false) })
            }
          />
        </Modal>
      )}
    </div>
  )
}

export const playlistsRoute = createRoute({
  path: "/playlists",
  component: PlaylistsPage,
  getParentRoute: () => appLayoutRoute,
})
