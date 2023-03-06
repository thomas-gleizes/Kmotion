import { useQuery } from "@tanstack/react-query"
import { api } from "../../utils/Api"

const PlaylistPage: Component = () => {
  const { data: playlists } = useQuery({
    queryKey: ["playlist"],
    queryFn: () => api.fetchPlaylists().then((response) => response.playlists),
    initialData: [],
  })

  return (
    <div>
      <h1>playlist page</h1>
      <div>
        {playlists.map((playlist) => (
          <div className="py-3">
            <div>{playlist.title}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PlaylistPage
