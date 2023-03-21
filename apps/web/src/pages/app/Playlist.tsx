import React, { MouseEventHandler } from "react"
import { useQuery } from "@tanstack/react-query"
import { Link, useParams } from "@tanstack/react-router"
import { FaChevronLeft, FaEllipsisH, FaPlay, IoShuffleOutline } from "react-icons/all"
import SimpleBar from "simplebar-react"

import { IMusic, IPlaylist, IPlaylistEntry } from "@kmotion/types"
import { api } from "../../utils/Api"
import { usePlayerContext } from "../../contexts/player"
import PlaylistGridImage from "../../components/common/PlaylistGridImage"

const Playlist: Page = () => {
  const { id } = useParams() as { id: string }

  const { actions } = usePlayerContext()

  const { data: playlist } = useQuery<IPlaylist>({
    queryKey: ["playlist", id],
    queryFn: () => api.fetchPlaylist(+id, false).then((data) => data.playlist),
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
  })

  const entriesQuery = useQuery<IPlaylistEntry[]>({
    queryKey: ["playlist-entries", id],
    queryFn: () => api.fetchEntries(+id, true).then((data) => data.entries),
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
  })

  const entries: IPlaylistEntry[] = entriesQuery.data || []
  const handleStopPropagation = (callback: () => void): MouseEventHandler<HTMLDivElement> => {
    return (event) => {
      event.stopPropagation()
      callback()
    }
  }

  const handlePlayPlaylist = (random: boolean) => {
    if (random)
      actions.set([...entries]?.sort(() => Math.random() - 0.5).map((entry) => entry.music))
    else actions.set(entries?.map((entry) => entry.music as IMusic))
  }

  const handlePlayMusic = (index: number) => {
    actions.set(
      entries?.map((entry) => entry.music as IMusic),
      index
    )
  }

  if (!playlist) return null

  return (
    <div className="relative text-white">
      <div className="absolute top-[36px] left-0 w-full bg-secondary z-20 bg-opacity-70 pb-1">
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
            <PlaylistGridImage ids={entries.map((entry) => entry.musicId)} />
          </div>
          <div className="my-6">
            <h3 className="text-center font-semibold text-2xl">{playlist.title}</h3>
          </div>
          <div className="flex justify-center space-x-3">
            <div>
              <button
                onClick={() => handlePlayPlaylist(false)}
                className="px-8 py-2 font-semibold flex items-center space-x-3 text-red-800 bg-secondary rounded-lg"
              >
                <FaPlay /> <span>Lecture</span>
              </button>
            </div>
            <div>
              <button
                onClick={() => handlePlayPlaylist(true)}
                className="px-8 py-2 font-semibold flex items-center space-x-3 text-red-800 bg-secondary rounded-lg"
              >
                <IoShuffleOutline /> <span>Aléatoire</span>
              </button>
            </div>
          </div>
          <div className="flex flex-col mt-6 border-t border-neutral-500 mx-3 py-1">
            {entries.map((entry, index) => (
              <div
                onClick={handleStopPropagation(() => handlePlayMusic(index))}
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
                    <div
                      className="basis-1/12 dropdown dropdown-left"
                      onClick={handleStopPropagation(() => null)}
                    >
                      <label className="cursor-pointer">
                        <FaEllipsisH />
                      </label>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                      >
                        <li>
                          <a>Item 1</a>
                        </li>
                        <li>
                          <a>Item 2</a>
                        </li>
                      </ul>
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
