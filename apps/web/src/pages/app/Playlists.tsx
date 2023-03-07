import React from "react"
import { useQuery } from "@tanstack/react-query"
import { FaChevronRight, FaPlus } from "react-icons/all"

import { IPlaylist } from "@kmotion/types"
import { api } from "../../utils/Api"

const PlaylistPage: Component = () => {
  const { data: playlists } = useQuery<IPlaylist[]>({
    queryKey: ["playlist"],
    queryFn: () => api.fetchPlaylists().then((response) => response.playlists),
    initialData: [],
  })

  return (
    <div className="p-4 text-white">
      <h2 className="text-4xl font-bold">Playlists</h2>
      <div className="flex flex-col space-y-2 mt-5">
        <div className="h-[100px] w-full cursor-pointer">
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
        {[...playlists, ...playlists, ...playlists].map((playlist) => (
          <div className="h-[100px] w-full cursor-pointer">
            <div className="flex items-center h-full">
              <div className="grid grid-cols-2 h-full bg-neutral-800 rounded-xl grid-rows-2 basis-1/4">
                <div
                  className="h-[50x] w-[50px] bg-cover bg-center rounded-tl-xl"
                  style={{ backgroundImage: "url(/api/v1/musics/22/cover)" }}
                />
                <div
                  className="h-[50px] w-[50px] bg-cover bg-center rounded-tr-xl"
                  style={{ backgroundImage: "url(/api/v1/musics/24/cover)" }}
                />
                <div
                  className="h-[50px] w-[50px] bg-cover bg-center rounded-bl-xl"
                  style={{ backgroundImage: "url(/api/v1/musics/20/cover)" }}
                />
                <div
                  className="h-[50px] w-[50px] bg-cover bg-center rounded-br-xl"
                  style={{ backgroundImage: "url(/api/v1/musics/25/cover)" }}
                />
              </div>
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
        ))}
      </div>
    </div>
  )
}

export default PlaylistPage
