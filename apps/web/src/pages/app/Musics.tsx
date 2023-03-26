import React, { Fragment, useMemo, useState } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
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
import { useAuthContext } from "../../contexts/auth"
import ImageLoader from "../../components/common/ImageLoader"
import ScrollableLayout from "../../components/layouts/ScrollableLayout"

const DisplayMode: Record<string, string> = {
  GRID: "grid",
  LIST: "list",
}

const Musics: Page = () => {
  const { actions } = usePlayerContext()
  const authContext = useAuthContext()

  const [displayMode, setDisplayMode] = useLocalStorageState<keyof typeof DisplayMode>(
    "displayMode",
    { defaultValue: DisplayMode.GRID }
  )

  const { data, fetchNextPage, isFetching } = useInfiniteQuery<IMusic[]>({
    queryKey: ["musics"],
    queryFn: ({ pageParam = 0 }) => {
      return api.fetchMusics(pageParam).then((data) => data.musics as IMusic[])
    },
    getNextPageParam: (_, pages) => pages.length,
    staleTime: 0,
    refetchOnMount: true,
  })

  const musics: IMusic[] = useMemo(() => (data ? data.pages.flat() : []), [data])

  const [search, setSearch] = useState<string>("")

  const filteredMusics = useMemo<IMusic[]>(
    () =>
      search === ""
        ? [...musics]
        : [...musics].filter(
            (music) =>
              music.title.toLowerCase().includes(search.toLowerCase()) ||
              (music.artist && music.artist.toLowerCase().includes(search.toLowerCase()))
          ),
    [musics, search]
  )

  const handlePlayRandom = () => actions.set([...musics]?.sort(() => Math.random() - 0.5))

  const handlePlayMusic = (index: number) => actions.set(musics, index)

  const handleDeleteMusic = async (music: IMusic) => {
    console.log("Delete", music)
  }

  const handleStopPropagation = (callback: () => void) => {
    return (event: React.MouseEvent) => {
      event.stopPropagation()
      callback()
    }
  }

  return (
    <ScrollableLayout>
      <div className="pb-5 mt-6 lg:mx-16">
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-4 px-3 sm:px-5 md:gap-10 md:px-10 xl:gap-20 xl:px-16">
            {filteredMusics.map((music) => (
              <div
                key={music.id}
                className="cursor-pointer"
                onClick={handleStopPropagation(() =>
                  handlePlayMusic(musics.findIndex((m) => m.id === music.id))
                )}
              >
                <div className="w-full">
                  <ImageLoader src={music.links.cover}>
                    {({ src }) => (
                      <img className="rounded-xl shadow-lg w-full" src={src} alt={music.title} />
                    )}
                  </ImageLoader>
                </div>
                <h2 className="text-white text-sm md:text-xl md:font-bold text-center overflow-y-hidden truncate w-full px-1">
                  {music.title}
                </h2>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-2 md:gap-y-10 md:gap-x-5 lg:gap-x-10">
            {filteredMusics.map((music) => (
              <div
                key={music.id}
                className="cursor-pointer"
                onClick={handleStopPropagation(() =>
                  handlePlayMusic(musics.findIndex((m) => m.id === music.id))
                )}
              >
                <div className="flex w-full">
                  <div className="w-1/5">
                    <ImageLoader src={music.links.cover}>
                      {({ src }) => (
                        <img className="w-full rounded-lg shadow-lg" src={src} alt={music.title} />
                      )}
                    </ImageLoader>
                  </div>
                  <div className="w-4/5 pl-3">
                    <div className="h-full border-b border-white/50 md:pl-2 flex items-center justify-between">
                      <div className="w-[85%] h-full flex flex-col justify-center">
                        <p className="truncate xl:text-3xl text-white">{music.title}</p>
                        <p className="text-sm text-white/70">{music.artist}</p>
                      </div>
                      <div className="w-[15%] text-center">
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
                                      onClick={handleStopPropagation(() =>
                                        handleDeleteMusic(music)
                                      )}
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
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-center mt-16">
          <button disabled={isFetching} className="btn btn-sm" onClick={() => fetchNextPage()}>
            Afficher plus
          </button>
        </div>
      </div>
    </ScrollableLayout>
  )
}

export default Musics
