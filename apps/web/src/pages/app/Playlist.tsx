import React, { MouseEventHandler } from "react"
import { useQuery } from "@tanstack/react-query"
import { Link, useParams } from "@tanstack/react-router"
import { FaChevronLeft, FaEllipsisH, FaPlay, IoShuffleOutline } from "react-icons/all"
import SimpleBar from "simplebar-react"

import { IPlaylist, IPlaylistEntry } from "@kmotion/types"
import { api } from "../../utils/Api"

const backgroundImgUrl = (id: number | undefined) => {
  if (id) return `/api/v1/musics/${id}/cover`
  return "/api/v1/musics/1/cover"
}
const Playlist: Page = () => {
  const { id } = useParams() as { id: string }

  const { data: playlist } = useQuery<IPlaylist>({
    queryKey: ["playlist", id],
    queryFn: () => api.fetchPlaylist(+id, false).then((res) => res.playlist),
  })

  const { data: entries } = useQuery<IPlaylistEntry[]>({
    queryKey: ["playlist-entries", id],
    queryFn: () => api.fetchEntries(+id, true).then((res) => res.entries),
    initialData: [],
  })

  const handleStopPropagation = (callback: () => void): MouseEventHandler<HTMLDivElement> => {
    return (event) => {
      event.stopPropagation()
      callback()
    }
  }

  const handlePlayPlaylist = (random: boolean) => {
    console.log("Random", random)
  }

  const handlePlayMusic = (entry: IPlaylistEntry) => {
    console.log("Entry", entry)
  }

  if (!playlist) return null

  return (
    <div className="relative text-white">
      <div className="absolute top-0 left-0 w-full bg-black z-10 bg-opacity-80 backdrop-blur-2xl pb-1">
        <div className="flex justify-between px-4 py-3">
          <Link to="/app/playlists">
            <FaChevronLeft className="text-red-800 text-2xl" />
          </Link>
          <div>
            <FaEllipsisH className="text-red-800 text-2xl" />
          </div>
        </div>
      </div>
      <SimpleBar className="max-h-[700px] pb-32">
        <div className="pt-24 px-2">
          <div className="relative h-[200px] w-[200px] mx-auto">
            <div className="grid grid-cols-2 grid-rows-2 h-full w-full rounded-xl bg-neutral-800">
              <div
                className="h-[100px] w-[100px] bg-cover bg-center rounded-tl-xl"
                style={{
                  backgroundImage: `url(${backgroundImgUrl(entries?.[0]?.musicId)})`,
                }}
              />
              <div
                className="h-[1/2] w-[1/2] bg-cover bg-center rounded-tr-xl"
                style={{
                  backgroundImage: `url(${backgroundImgUrl(entries?.[1]?.musicId)})`,
                }}
              />
              <div
                className="h-[1/2] w-[1/2] bg-cover bg-center rounded-bl-xl"
                style={{
                  backgroundImage: `url(${backgroundImgUrl(entries?.[2]?.musicId)})`,
                }}
              />
              <div
                className="h-[1/2] w-[1/2] bg-cover bg-center rounded-br-xl"
                style={{
                  backgroundImage: `url(${backgroundImgUrl(entries?.[3]?.musicId)})`,
                }}
              />
            </div>
          </div>
          <div className="my-6">
            <h3 className="text-center font-semibold text-2xl">{playlist.title}</h3>
          </div>
          <div className="flex justify-center space-x-3">
            <div>
              <button
                onClick={() => handlePlayPlaylist(false)}
                className="px-8 py-2 font-semibold flex items-center space-x-3 text-red-800 bg-black rounded-lg"
              >
                <FaPlay /> <span>Lecture</span>
              </button>
            </div>
            <div>
              <button
                onClick={() => handlePlayPlaylist(true)}
                className="px-8 py-2 font-semibold flex items-center space-x-3 text-red-800 bg-black rounded-lg"
              >
                <IoShuffleOutline /> <span>Aléatoire</span>
              </button>
            </div>
          </div>
          <div className="flex flex-col mt-8 border-t border-neutral-500 mx-3 py-1">
            {entries.map((entry, index) => (
              <div
                onClick={handleStopPropagation(() => handlePlayMusic(entry))}
                key={index}
                className="h-[55px] cursor-pointer"
              >
                <div className="flex items-center h-full">
                  <div className="basis-1/5 h-full py-2">
                    <img
                      className="h-full rounded-lg"
                      src={`/api/v1/musics/${entry.musicId}/cover`}
                      alt={entry.music?.title}
                    />
                  </div>
                  <div className="basis-4/5 h-full px-1 flex justify-between items-center border-b border-neutral-500">
                    <div className="basis-9/12">
                      <p className="truncate max-w-[240px]">{entry.music?.title}</p>
                      <p className="text-sm text-opacity-70 text-white max-w-[240px]">
                        {entry.music?.artist}
                      </p>
                    </div>
                    <div className="basis-1/12">
                      <FaEllipsisH />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-3 pt-3">
            <p className="text-white text-sm text-opacity-80">
              {entries.length} morceaux, 3 heurs et 21 minutes
            </p>
          </div>
        </div>
      </SimpleBar>
    </div>
  )
}

export default Playlist
