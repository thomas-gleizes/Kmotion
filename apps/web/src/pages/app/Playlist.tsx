import React from "react"
import { useQuery } from "@tanstack/react-query"
import { Link, useParams } from "@tanstack/react-router"

import { IPlaylist, IPlaylistEntry } from "@kmotion/types"
import { api } from "../../utils/Api"
import { FaChevronLeft, FaEllipsisH, FaPlay, IoShuffleOutline } from "react-icons/all"

const backgroundImgUrl = (id: number | undefined) => {
  if (id) return `/api/v1/musics/${id}/cover`
  return "/api/v1/musics/1/cover"
}
const Playlist: Page = () => {
  const { id } = useParams() as { id: string }

  const { data: playlist } = useQuery<IPlaylist>({
    queryKey: ["playlist", id],
    queryFn: () => api.fetchPlaylist(+id, true).then((res) => res.playlist),
  })

  const { data: entries } = useQuery<IPlaylistEntry[]>({
    queryKey: ["playlist-entries", id],
    queryFn: () => api.fetchEntries(+id, { music: true }).then((res) => res.entries),
    initialData: [],
  })

  if (!playlist) return null

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

      <div className="pt-16 px-2">
        <div>
          <div className="relative grid grid-cols-2 h-full h-[200px] mx-auto w-[200px] bg-neutral-800 rounded-xl grid-rows-2 basis-1/4">
            <div
              className="h-[1/2] w-[1/2] bg-cover bg-center rounded-tl-xl"
              style={{
                backgroundImage: `url(${backgroundImgUrl(playlist?.entries?.[0]?.musicId)})`,
              }}
            />
            <div
              className="h-[1/2] w-[1/2] bg-cover bg-center rounded-tr-xl"
              style={{
                backgroundImage: `url(${backgroundImgUrl(playlist?.entries?.[1]?.musicId)})`,
              }}
            />
            <div
              className="h-[1/2] w-[1/2] bg-cover bg-center rounded-bl-xl"
              style={{
                backgroundImage: `url(${backgroundImgUrl(playlist?.entries?.[2]?.musicId)})`,
              }}
            />
            <div
              className="h-[1/2] w-[1/2] bg-cover bg-center rounded-br-xl"
              style={{
                backgroundImage: `url(${backgroundImgUrl(playlist?.entries?.[3]?.musicId)})`,
              }}
            />
          </div>
          <div className="my-6">
            <h3 className="text-center font-semibold text-2xl">{playlist.title}</h3>
          </div>
          <div className="flex justify-center space-x-3">
            <div>
              <button className="px-8 py-2 font-semibold flex items-center space-x-3 text-red-800 bg-black rounded-lg">
                <FaPlay /> <span>Lecture</span>
              </button>
            </div>
            <div>
              <button className="px-8 py-2 font-semibold flex items-center space-x-3 text-red-800 bg-black rounded-lg">
                <IoShuffleOutline /> <span>Aléatoire</span>
              </button>
            </div>
          </div>
          <div className="flex flex-col mt-8 border-y border-neutral-500 mx-3 py-2">
            {entries.map((entry, index) => (
              <div key={index} className="py-2">
                <div className="flex space-x-3 items-center">
                  <img
                    className="w-[70px] rounded-lg"
                    src={`/api/v1/musics/${entry.musicId}/cover`}
                    alt={entry.music?.title}
                  />
                  <div className="flex justify-between pr-3 w-full border-b border-neutral-500">
                    <div className="">
                      <p className="text-sm">{entry.music?.title}</p>
                    </div>
                    <div>
                      <FaEllipsisH />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Playlist
