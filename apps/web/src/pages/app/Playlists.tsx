import React from "react"
import { useRouter } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { FaChevronRight } from "react-icons/all"

import { IPlaylist } from "@kmotion/types"
import { api } from "../../utils/Api"
import { useToggle } from "react-use"
import CreatePlaylist from "../../components/modals/CreatePlaylist"
import PlaylistGridImage from "../../components/common/PlaylistGridImage"
import ScrollableLayout from "../../components/layouts/ScrollableLayout"
import { QUERIES_KEY } from "../../utils/constants"

const PlaylistPage: Component = () => {
  const { data: playlists, refetch } = useQuery<IPlaylist[]>({
    queryKey: QUERIES_KEY.playlists,
    queryFn: () => api.fetchPlaylists(true).then((response) => response.playlists),
    refetchOnMount: true,
    staleTime: 1000 * 60,
  })

  const router = useRouter()

  const [isOpen, toggleOpen] = useToggle(false)

  const handleValid = async () => {
    toggleOpen(false)
    const test = await refetch()
    console.log("Test", test)
  }

  return (
    <ScrollableLayout>
      <CreatePlaylist isOpen={isOpen} close={() => toggleOpen(false)} onValid={handleValid} />
      <h2 className="text-4xl mt-8 font-bold text-white/90">Playlists</h2>
      <div className="grid grid-cols-1 gap-y-5 mt-5">
        <div className="w-full flex cursor-pointer" onClick={() => toggleOpen()}>
          <div>
            <div className="h-[100px] w-[100px] lg:h-[200px] lg:w-[200px]">
              <PlaylistGridImage ids={[]} />
            </div>
          </div>
          <div className="w-full px-2">
            <div className="flex justify-between px-2 items-center h-full border-b border-stone-700">
              <div className="pl-3">
                <h5 className="font-bold text-red-700 text-lg">Nouvelle playlist ...</h5>
              </div>
              <div>
                <FaChevronRight className="text-red-700" />
              </div>
            </div>
          </div>
        </div>
        {(playlists || []).map((playlist, index) => (
          <div
            key={index}
            className="w-full flex cursor-pointer"
            onClick={() => router.history.push(`/app/playlist/${playlist.id}`, null)}
          >
            <div>
              <div className="h-[100px] w-[100px] lg:h-[200px] lg:w-[200px]">
                <PlaylistGridImage
                  ids={(playlist.entries || [])
                    .sort((a, b) => a.position - b.position)
                    .map((entry) => entry.musicId)}
                />
              </div>
            </div>
            <div className="w-full px-2">
              <div className="flex justify-between px-2 items-center h-full border-b border-stone-700">
                <div className="pl-3">
                  <h5 className="font-bold text-white/90 text-lg">{playlist.title}</h5>
                  <p className="text-white/75 overflow-hidden text-sm">{playlist.description}</p>
                </div>
                <div>
                  <FaChevronRight className="text-white/60" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollableLayout>
  )
}

export default PlaylistPage
