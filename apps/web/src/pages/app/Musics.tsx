import React, { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import SimpleBar from "simplebar-react"
import { FaEllipsisH, FaList, FaPlay, FaSearch, FaThLarge, IoShuffleOutline } from "react-icons/all"
import useLocalStorageState from "use-local-storage-state"

import { IMusic } from "@kmotion/types"
import { api } from "../../utils/Api"
import { usePlayerContext } from "../../contexts/player"
import ImageLoader from "../../components/common/ImageLoader"

const DisplayMode: Record<string, string> = {
  GRID: "grid",
  LIST: "list",
}

const Musics: Page = () => {
  const { actions } = usePlayerContext()

  const [displayMode, setDisplayMode] = useLocalStorageState<keyof typeof DisplayMode>(
    "displayMode",
    { defaultValue: DisplayMode.GRID }
  )

  const { data: musics } = useQuery<IMusic[]>({
    queryKey: ["musics"],
    queryFn: () => api.fetchMusics().then((data) => data.musics as IMusic[]),
    initialData: [],
    refetchOnMount: "always",
  })

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

  return (
    <div className="relative">
      <SimpleBar className="max-h-[700px] pt-16 px-2">
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
        <div className="flex justify-center space-x-3 mt-5">
          <button
            onClick={() => handlePlayMusic(0)}
            className="w-full px-8 py-2 font-semibold flex justify-center items-center space-x-3 text-red-800 bg-secondary rounded-lg"
          >
            <FaPlay /> <span>Lecture</span>
          </button>
          <button
            onClick={() => handlePlayRandom()}
            className="w-full px-8 py-2 font-semibold flex justify-center items-center space-x-3 text-red-800 bg-secondary rounded-lg"
          >
            <IoShuffleOutline /> <span>Aléatoire</span>
          </button>
        </div>
        <div className="mt-3">
          {displayMode === DisplayMode.GRID ? (
            <div className="grid grid-cols-2 gap-4">
              {filteredMusics.map((music) => (
                <div
                  key={music.id}
                  onClick={() => handlePlayMusic(musics.findIndex((m) => m.id === music.id))}
                  className="cursor-pointer"
                >
                  <div>
                    <ImageLoader src={music.links.cover}>
                      {({ src }) => (
                        <img className="rounded-xl shadow-lg" src={src} alt={music.title} />
                      )}
                    </ImageLoader>
                  </div>
                  <h2 className="text-white text-center overflow-y-hidden truncate w-full px-1">
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
                  onClick={() => handlePlayMusic(musics.findIndex((m) => m.id === music.id))}
                  className="cursor-pointer"
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
                      <div className="basis-1/12 dropdown dropdown-left">
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
          )}
        </div>
      </SimpleBar>
    </div>
  )
}

export default Musics
