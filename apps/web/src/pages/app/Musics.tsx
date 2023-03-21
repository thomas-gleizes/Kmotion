import React, { Fragment, useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import SimpleBar from "simplebar-react"
import useLocalStorageState from "use-local-storage-state"
import { Menu, Transition } from "@headlessui/react"
import {
  CgRowFirst,
  CgRowLast,
  FaEllipsisH,
  FaHeart,
  FaList,
  FaPlay,
  FaPlus,
  FaSearch,
  FaThLarge,
  FaTrash,
  IoShuffleOutline,
} from "react-icons/all"

import { IMusic } from "@kmotion/types"
import { api } from "../../utils/Api"
import { usePlayerContext } from "../../contexts/player"
import ImageLoader from "../../components/common/ImageLoader"
import { useAuthContext } from "../../contexts/auth"

const DisplayMode: Record<string, string> = {
  GRID: "grid",
  LIST: "list",
}

const Musics: Page = () => {
  const { actions } = usePlayerContext()
  const authContext = useAuthContext("yes")

  const [displayMode, setDisplayMode] = useLocalStorageState<keyof typeof DisplayMode>(
    "displayMode",
    { defaultValue: DisplayMode.GRID }
  )

  const musicsQuery = useQuery<IMusic[]>({
    queryKey: ["musics"],
    queryFn: () => api.fetchMusics().then((data) => data.musics as IMusic[]),
    refetchOnMount: true,
    staleTime: 1000 * 30,
  })

  const musics: IMusic[] = musicsQuery.data || []

  const [search, setSearch] = useState<string>("")

  const filteredMusics = useMemo<IMusic[]>(
    () =>
      search === ""
        ? [...musics]
        : [...musics].filter(
            (music) =>
              music.title.toLowerCase().includes(search) ||
              (music.artist && music.artist.toLowerCase().includes(search))
          ),
    [musics, search]
  )

  const handlePlayRandom = () => actions.set([...musics]?.sort(() => Math.random() - 0.5))

  const handlePlayMusic = (index: number) => actions.set(musics, index)

  const handleStopPropagation = (callback: () => void) => {
    return (event: React.MouseEvent) => {
      event.stopPropagation()
      callback()
    }
  }

  return (
    <div className="relative">
      <SimpleBar className="max-h-[700px] pt-16 pb-42 px-2">
        <div className="mx-2 pb-5">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-semibold text-white">Morceaux</h1>
            <div className="text-2xl text-red-600">
              {displayMode === DisplayMode.GRID ? (
                <button onClick={() => setDisplayMode(DisplayMode.LIST)}>
                  <FaThLarge />
                </button>
              ) : (
                <button onClick={() => setDisplayMode(DisplayMode.GRID)}>
                  <FaList />
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2 py-1 text-white/90 group rounded-lg bg-secondary px-3 my-2 transition">
            <FaSearch className="text-xl" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="bg-transparent w-full px-1 text-xl placeholder:text-white/70"
              placeholder="Rechercher des Morceau"
            />
          </div>
        </div>
        <div className="flex justify-center space-x-3 mb-10">
          <button
            onClick={() => handlePlayMusic(0)}
            className="px-8 py-2 font-semibold flex justify-center items-center space-x-3 text-red-800 bg-secondary rounded-lg"
          >
            <FaPlay /> <span>Lecture</span>
          </button>
          <button
            onClick={() => handlePlayRandom()}
            className="px-8 py-2 font-semibold flex justify-center items-center space-x-3 text-red-800 bg-secondary rounded-lg"
          >
            <IoShuffleOutline /> <span>Aléatoire</span>
          </button>
        </div>
        <div className="mt-3">
          {displayMode === DisplayMode.GRID ? (
            <div className="grid grid-cols-2 gap-x-5 gap-y-4 px-3">
              {filteredMusics.map((music) => (
                <div
                  key={music.id}
                  className="cursor-pointer"
                  onClick={handleStopPropagation(() =>
                    handlePlayMusic(musics.findIndex((m) => m.id === music.id))
                  )}
                >
                  <div>
                    <ImageLoader src={music.links.cover}>
                      {({ src }) => (
                        <img className="rounded-xl shadow-lg mb-1" src={src} alt={music.title} />
                      )}
                    </ImageLoader>
                  </div>
                  <h2 className="text-white text-sm text-center overflow-y-hidden truncate w-full px-1">
                    {music.title}
                  </h2>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-y-2">
              {filteredMusics.map((music) => (
                <div
                  key={music.id}
                  className="cursor-pointer"
                  onClick={handleStopPropagation(() =>
                    handlePlayMusic(musics.findIndex((m) => m.id === music.id))
                  )}
                >
                  <div className="flex items-center h-full">
                    <div className="basis-1/5 py-2">
                      <ImageLoader src={music.links.cover}>
                        {({ src }) => (
                          <img className="w-full rounded-lg" src={src} alt={music.title} />
                        )}
                      </ImageLoader>
                    </div>
                    <div className="basis-4/5 h-full px-2 mx-1 flex justify-between items-center border-b border-neutral-500">
                      <div className="basis-9/12 max-w-[240px]">
                        <p className="truncate text-white">{music.title}</p>
                        <p className="text-sm text-white/70">{music.artist}</p>
                      </div>
                      <div className="basis-1/12">
                        <Menu as="div" className="relative inline-block text-left">
                          <div>
                            <Menu.Button
                              onClick={handleStopPropagation(() => null)}
                              className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                            >
                              <FaEllipsisH className="" aria-hidden="true" />
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
                                {authContext.authenticated && authContext.user.isAdmin && (
                                  <Menu.Item>
                                    <button
                                      onClick={handleStopPropagation(() => null)}
                                      className="w-full px-2 py-1 text-primary hover:bg-primary/10 text-xl font-semibold flex items-center justify-between space-x-2 rounded-lg"
                                    >
                                      <span>Supprimer</span>
                                      <FaTrash />
                                    </button>
                                  </Menu.Item>
                                )}
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
                                    onClick={handleStopPropagation(() => actions.addNext(music))}
                                    className="w-full px-2 py-1 text-white hover:bg-white/10 text-xl font-semibold flex items-center justify-between space-x-2 rounded-lg"
                                  >
                                    <span>Lire ensuite</span>
                                    <CgRowFirst />
                                  </button>
                                </Menu.Item>
                                <Menu.Item>
                                  <button
                                    onClick={handleStopPropagation(() => actions.addLast(music))}
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
              ))}
            </div>
          )}
        </div>
      </SimpleBar>
    </div>
  )
}

export default Musics
