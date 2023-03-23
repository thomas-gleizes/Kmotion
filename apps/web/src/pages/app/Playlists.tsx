import React from "react"
import { Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { FaChevronRight } from "react-icons/all"

import { IPlaylist } from "@kmotion/types"
import { api } from "../../utils/Api"
import { useToggle } from "react-use"
import CreatePlaylist from "../../components/modals/CreatePlaylist"
import PlaylistGridImage from "../../components/common/PlaylistGridImage"
import ScrollableLayout from "../../components/layouts/ScrollableLayout"

const PlaylistPage: Component = () => {
  const { data: playlists } = useQuery<IPlaylist[]>({
    queryKey: ["playlists"],
    queryFn: () => api.fetchPlaylists(true).then((response) => response.playlists),
    refetchOnMount: true,
    staleTime: 1000 * 60,
  })

  const [isOpen, toggleOpen] = useToggle(false)

  return (
    <ScrollableLayout>
      <CreatePlaylist isOpen={isOpen} close={() => toggleOpen(false)} />
      <h2 className="text-4xl font-bold text-white/90">Playlists</h2>
      <div className="grid grid-cols-1 gap-y-4 mt-5">
        <div className="w-full cursor-pointer" onClick={toggleOpen}>
          <div className="flex items-center h-full">
            <div className="h-[200px] w-[200px]">
              <PlaylistGridImage ids={[]} />
            </div>
            <div className="px-2 h-full">
              <div className="flex justify-between items-center h-full border-b border-stone-700">
                <div className="pl-3">
                  <h5 className="text-red-700">Nouvelle playlist...</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
        {(playlists || []).map((playlist, index) => (
          <Link className="w-full" key={index} to={`/app/playlist/${playlist.id}`}>
            <div className="w-full">
              <div className="w-full cursor-pointer">
                <div className="h-[200px] w-[200px]">
                  <PlaylistGridImage
                    ids={(playlist.entries || [])
                      .sort((a, b) => a.position - b.position)
                      .map((entry) => entry.musicId)}
                  />
                  <div className="h-full">
                    <div className="flex justify-between items-center h-full border-b border-stone-700">
                      <div className="pl-3">
                        <h5 className="font-bold text-white/90 text-lg">{playlist.title}</h5>
                        <p className="text-white/75 overflow-hidden text-sm">
                          {playlist.description}
                        </p>
                      </div>
                      <div>
                        <FaChevronRight className="text-white/60" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>{" "}
          </Link>
        ))}
      </div>
    </ScrollableLayout>
  )
}

export default PlaylistPage
