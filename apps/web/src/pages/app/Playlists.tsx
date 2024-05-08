import React from "react"
import { Link, useRouter } from "@tanstack/react-router"
import { queryOptions, useQuery } from "@tanstack/react-query"
import { FaChevronRight, FaPlus } from "react-icons/fa"
import { useDialog } from "react-dialog-promise"

import { IPlaylist } from "@kmotion/types"
import { api } from "../../utils/Api"
import PlaylistGridImage from "../../components/common/PlaylistGridImage"
import ScrollableLayout from "../../components/layouts/ScrollableLayout"
import EditPlaylist from "../../components/modals/EditPlaylist"

export const playlistsQueryOptions = queryOptions<IPlaylist[]>({
  queryKey: ["playlists"],
  queryFn: () => api.fetchPlaylists(true).then((resp) => resp.playlists),
  refetchOnMount: true,
  staleTime: 1000 * 60,
})

const PlaylistPage: Component = () => {
  const editPlaylist = useDialog(EditPlaylist)

  const { data: playlists, refetch } = useQuery(playlistsQueryOptions)

  const handleEditPlaylist = async () => {
    const result = await editPlaylist.open({
      isNew: true,
      musics: [],
      initialValues: { title: "", description: "", musics: [] },
    })

    if (result.action === "success-new") void refetch()
  }

  return (
    <ScrollableLayout>
      <div className="px-3 lg:px-8">
        <h2 className="text-4xl mt-8 font-bold text-white/90">Playlists</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-8 gap-y-5 mt-5">
          <div className="w-full lg:col-span-2 flex cursor-pointer" onClick={handleEditPlaylist}>
            <div>
              <div className="h-[100px] w-[100px] lg:h-[200px] lg:w-[200px] flex items-center justify-center rounded-xl border border-neutral-800">
                <div className="text-4xl text-primary">
                  <FaPlus />
                </div>
              </div>
            </div>
            <div className="w-full px-2">
              <div className="flex justify-between px-2 items-center h-full border-b border-stone-700">
                <div className="lg:pl-3">
                  <h5 className="font-bold text-red-700 text-lg lg:text-2xl">
                    Nouvelle playlist ...
                  </h5>
                </div>
                <div>
                  <FaChevronRight className="text-red-700" />
                </div>
              </div>
            </div>
          </div>
          {(playlists || []).map((playlist, index) => (
            <Link
              key={index}
              className="w-full flex cursor-pointer"
              to="/app/playlist/$id"
              params={{ id: playlist.id.toString() }}
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
                  <div className="lg:pl-3 space-y-0.5 lg:space-y-3">
                    <h5 className="font-bold text-white/90 text-lg lg:text-2xl">
                      {playlist.title}
                    </h5>
                    <p className="text-white/75 overflow-hidden text-sm lg:text-xl">
                      {playlist.description}
                    </p>
                  </div>
                  <div>
                    <FaChevronRight className="text-white/60" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </ScrollableLayout>
  )
}

export default PlaylistPage
