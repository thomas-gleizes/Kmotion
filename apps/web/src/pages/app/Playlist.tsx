import React, { Fragment, MouseEventHandler, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { useParams, useRouter } from "@tanstack/react-router"
import { Menu, Transition } from "@headlessui/react"
import {
  CgRowFirst,
  CgRowLast,
  FaChevronLeft,
  FaEllipsisH,
  FaHeart,
  FaPlay,
  FaPlus,
  FaTrash,
  IoShuffleOutline,
} from "react-icons/all"

import { IMusic, IPlaylist, IPlaylistEntry } from "@kmotion/types"
import { api } from "../../utils/Api"
import { usePlayerContext } from "../../contexts/player"
import PlaylistGridImage from "../../components/common/PlaylistGridImage"
import ScrollableLayout from "../../components/layouts/ScrollableLayout"
import ImageLoader from "../../components/common/ImageLoader"
import EditPlaylist from "../../components/modals/EditPlaylist"
import { useModalContext } from "../../contexts/modals"

const Playlist: Page = () => {
  const { id } = useParams() as { id: string }
  const { history } = useRouter()

  const {
    actions,
    playlist: { set: setPlaylist },
  } = usePlayerContext()

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

  const handleStopPropagation = (callback: () => void): MouseEventHandler => {
    return (event) => {
      event.stopPropagation()
      callback()
    }
  }

  const handlePlayPlaylist = (random: boolean) => {
    setPlaylist(playlist as IPlaylist)
    if (random)
      actions.set(
        [...entries]?.sort(() => Math.random() - 0.5).map((entry) => entry.music as IMusic)
      )
    else actions.set(entries?.map((entry) => entry.music as IMusic))
  }

  const handlePlayMusic = (index: number) => {
    setPlaylist(playlist as IPlaylist)
    actions.set(
      entries?.map((entry) => entry.music as IMusic),
      index
    )
  }

  const modal = useModalContext()

  const handleEditPlaylist = async () => {
    if (!playlist) return null

    const result = await modal.open(
      <EditPlaylist
        musics={entries.map((entry) => entry.music as IMusic)}
        initialValues={{
          title: playlist.title,
          description: playlist.description,
          musics: entries.map((entry) => entry.musicId),
        }}
      />
    )

    console.log("Result", result)
  }

  const time = useMemo<{ hours: number; minutes: number }>(() => {
    const seconds = entries.reduce((acc, entry) => acc + (entry.music as IMusic).duration, 0)

    return {
      hours: Math.floor(seconds / 3600),
      minutes: Math.floor((seconds % 3600) / 60),
    }
  }, [entries])

  if (!playlist) return null

  return (
    <div className="relative">
      <div className="absolute z-30 lg:hidden top-0 left-0 w-full py-3 bg-secondary/70 backdrop-blur">
        <div className="flex justify-between px-3">
          <button onClick={() => history.back()}>
            <FaChevronLeft className="text-primary text-xl" onClick={() => null} />
          </button>
          <button onClick={handleEditPlaylist} className="text-primary">
            Modifier
          </button>
        </div>
      </div>
      <ScrollableLayout>
        <div className="relative top-8 flex flex-col lg:flex-row">
          <div className="lg:sticky lg:h-full lg:top-10 lg:bottom-0 lg:w-1/3 flex flex-col lg:justify-center space-y-3">
            <div className="h-[200px] w-[200px] lg:w-[300px] lg:h-[300px] xl:w-[420px] xl:h-[420px] mx-auto mt-10">
              <PlaylistGridImage ids={entries.map((entry) => entry.musicId)} />
            </div>
            <div className="">
              <h3 className="text-center font-semibold text-2xl text-white">{playlist.title}</h3>
              <p className="text-white/50 mx-auto w-11/12 lg:text-center">{playlist.description}</p>
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
          </div>
          <div className="lg:w-2/3 lg:px-5 py-1 mt-6">
            <div className="text-white/90">
              {entries.length} morceaux, {time.hours} heure{time.hours > 1 && "s"} et {time.minutes}{" "}
              minute{time.minutes > 1 && "s"}
            </div>
            <div className="grid grid-cols-1 border-t border-white/75">
              {entries.map((entry, index) => (
                <div
                  onClick={handleStopPropagation(() => handlePlayMusic(index))}
                  key={index}
                  className="cursor-pointer"
                >
                  <div className="flex h-full">
                    <div className="w-1/5 h-full py-2">
                      <ImageLoader src={`/api/v1/musics/${entry.musicId}/cover`}>
                        {({ src }) => (
                          <img className="w-full rounded-lg" src={src} alt={entry.music?.title} />
                        )}
                      </ImageLoader>
                    </div>
                    <div className="w-4/5 pl-3">
                      <div className="h-full border-b border-white/50 md:pl-2 flex items-center justify-between">
                        <div className="w-[85%] h-full flex flex-col justify-center">
                          <p className="truncate xl:text-3xl text-white">{entry.music.title}</p>
                          <p className="text-sm text-white/70">{entry.music.artist}</p>
                        </div>
                        <div className="w-[15%] text-center">
                          <Menu as="div" className="relative inline-block text-left">
                            <div>
                              <Menu.Button
                                onClick={handleStopPropagation(() => null)}
                                className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                              >
                                <FaEllipsisH
                                  className="sm:text-xl md:text-2xl lg:text-4xl"
                                  aria-hidden="true"
                                />
                              </Menu.Button>
                            </div>
                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="z-[100000] absolute right-0 mt-2 w-56 p-1 origin-top-right divide-y divide-gray-100 rounded-lg bg-secondary backdrop-blur-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                  <Menu.Item>
                                    <button className="w-full px-2 py-1 text-primary hover:bg-primary/10 text-xl font-semibold flex items-center justify-between space-x-2 rounded-lg">
                                      <span>Supprimer</span>
                                      <FaTrash />
                                    </button>
                                  </Menu.Item>

                                  <Menu.Item>
                                    <button
                                      onClick={handleStopPropagation(() => null)}
                                      className="w-full px-2 py-1 text-white hover:bg-white/10 text-xl font-semibold flex items-center justify-between space-x-2 rounded-lg"
                                    >
                                      <span className="truncate">Ajouter à une playlist... </span>
                                      <FaPlus />
                                    </button>
                                  </Menu.Item>
                                  <Menu.Item>
                                    <button
                                      onClick={handleStopPropagation(() => null)}
                                      className="w-full px-2 py-1 text-white hover:bg-white/10 text-xl font-semibold flex items-center justify-between space-x-2 rounded-lg"
                                    >
                                      <span className="truncate">J'aime </span>
                                      <FaHeart />
                                    </button>
                                  </Menu.Item>
                                </div>
                                <div className="py-1">
                                  <Menu.Item>
                                    <button
                                      onClick={handleStopPropagation(() =>
                                        actions.addNext(entry.music as IMusic)
                                      )}
                                      className="w-full px-2 py-1 text-white hover:bg-white/10 text-xl font-semibold flex items-center justify-between space-x-2 rounded-lg"
                                    >
                                      <span>Lire ensuite</span>
                                      <CgRowFirst />
                                    </button>
                                  </Menu.Item>
                                  <Menu.Item>
                                    <button
                                      onClick={handleStopPropagation(() =>
                                        actions.addLast(entry.music as IMusic)
                                      )}
                                      className="w-full px-2 py-1 text-white hover:bg-white/10 text-xl font-semibold flex items-center justify-between space-x-2 rounded-lg"
                                    >
                                      <span>Lire en dernier</span>
                                      <CgRowLast />
                                    </button>
                                  </Menu.Item>
                                </div>
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-3 pt-3">
              <p className="text-white text-sm text-opacity-80">
                {entries.length} morceaux, {time.hours} heure{time.hours > 1 && "s"} et{" "}
                {time.minutes} minute{time.minutes > 1 && "s"}{" "}
              </p>
            </div>
          </div>
        </div>
      </ScrollableLayout>
    </div>
  )
}

export default Playlist
