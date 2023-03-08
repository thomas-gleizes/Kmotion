import React from "react"
import { useQuery } from "@tanstack/react-query"
import { useParams, Link } from "@tanstack/react-router"

import { IPlaylist } from "@kmotion/types"
import { api } from "../../utils/Api"
import { FaChevronLeft, FaEllipsisH } from "react-icons/all"

const Playlist: Page = () => {
  const { id } = useParams() as { id: string }

  const { data: playlist } = useQuery<IPlaylist>({
    queryKey: ["playlist", id],
    queryFn: () => api.fetchPlaylist(+id).then((res) => res.playlist),
  })

  return (
    <div className="relative text-white">
      <div className="absolute top-0 left-0 w-full bg-black bg-opacity-80 backdrop-blur-2xl pb-1">
        <div className="flex justify-between px-4 py-3">
          <Link to="/app/playlists">
            <FaChevronLeft className="text-red-800 text-2xl" />
          </Link>
          <div>
            <FaEllipsisH className="text-red-800 text-2xl" />
          </div>
        </div>
      </div>

      <div className="p-4">{playlist?.title}</div>
    </div>
  )
}

export default Playlist
