import React from "react"
import { Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { FaChevronRight, FaPlus } from "react-icons/all"
import SimpleBar from "simplebar-react"

import { IPlaylist } from "@kmotion/types"
import { api } from "../../utils/Api"
import { useToggle } from "react-use"
import CreatePlaylist from "../../components/modals/CreatePlaylist"
import PlaylistGridImage from "../../components/common/PlaylistGridImage"

const PlaylistPage: Component = () => {
  const { data: playlists } = useQuery<IPlaylist[]>({
    queryKey: ["playlists"],
    queryFn: () => api.fetchPlaylists(true).then((response) => response.playlists),
    initialData: [],
  })

  const [isOpen, toggleOpen] = useToggle(false)

  return (
    <SimpleBar className="max-h-[700px] pt-12 pb-56">
      <CreatePlaylist isOpen={isOpen} close={() => toggleOpen(false)} />
      <div className="px-4 text-white">
        <h2 className="text-4xl font-bold text-opacity-90">Playlists</h2>
        <div className="flex flex-col space-y-2 mt-5">
          <div className="h-[100px] w-full cursor-pointer" onClick={toggleOpen}>
            <div className="flex items-center h-full">
              <div className="basis-1/4 flex items-center justify-center bg-neutral-800 rounded-xl h-full w-[100px]">
                <FaPlus className="text-red-600 text-3xl" />
              </div>
              <div className="basis-3/4 px-2 h-full">
                <div className="flex justify-between items-center h-full border-b border-stone-700">
                  <div className="pl-3">
                    <h5 className="text-red-700">Nouvelle playlist...</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {playlists.map((playlist, index) => (
            <Link key={index} to={`/app/playlist/${playlist.id}`}>
              <div className="h-[100px] w-full cursor-pointer">
                <div className="flex items-center h-full">
                  <PlaylistGridImage
                    ids={(playlist.entries || [])
                      .sort((a, b) => a.position - b.position)
                      .map((entry) => entry.musicId)}
                    className="basis-1/4"
                  />
                  <div className="basis-3/4 px-2 h-full">
                    <div className="flex justify-between items-center h-full border-b border-stone-700">
                      <div className="pl-3">
                        <h5 className="font-bold text-lg">{playlist.title}</h5>
                        <p className="text-gray-200 text-opacity-75 overflow-hidden text-sm">
                          {playlist.description}
                        </p>
                      </div>
                      <div>
                        <FaChevronRight className="text-stone-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </SimpleBar>
  )
}

export default PlaylistPage