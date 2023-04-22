import React, { useEffect, useMemo, useState } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import useLocalStorageState from "use-local-storage-state"
import { useDialog } from "react-dialog-promise"
import {
  CgRowFirst,
  FaList,
  FaPlay,
  FaSearch,
  FaShare,
  FaThLarge,
  FaTrash,
  IoShuffleOutline,
} from "react-icons/all"

import { IMusic, MusicResponse } from "@kmotion/types"
import { api } from "../../utils/Api"
import { handleStopPropagation } from "../../utils/helpers"
import { usePlayerContext } from "../../contexts/player"
import { useAuthenticatedContext } from "../../contexts/auth"
import { useIsDisplay } from "../../hooks"
import ImageLoader from "../../components/common/ImageLoader"
import ScrollableLayout from "../../components/layouts/ScrollableLayout"
import FallbackImage from "../../components/common/FallbackImage"
import MusicSkeleton from "../../components/common/Music/MusicSkeleton"
import SharedMusic from "../../components/modals/SharedMusic"
import { MusicItem, MusicItemActions } from "../../components/common/Music/List"
import AddToPlaylist from "../../components/modals/AddToPlaylist"
import EditPlaylist from "../../components/modals/EditPlaylist"
import ConfirmDialog from "../../components/modals/ConfirmDialog"

const DisplayMode: Record<string, string> = {
  GRID: "grid",
  LIST: "list",
}

const Musics: Page = () => {
  const {
    actions,
    playlist: { set: setPlaylist },
  } = usePlayerContext()

  const { user } = useAuthenticatedContext()

  const shareDialog = useDialog(SharedMusic)
  const addToPlaylist = useDialog(AddToPlaylist)
  const editPlaylist = useDialog(EditPlaylist)
  const confirmDialog = useDialog(ConfirmDialog)

  const [displayMode, setDisplayMode] = useLocalStorageState<keyof typeof DisplayMode>(
    "displayMode",
    { defaultValue: DisplayMode.GRID }
  )

  const { data, fetchNextPage, isFetching, refetch } = useInfiniteQuery<MusicResponse>({
    queryKey: ["musics"],
    queryFn: ({ pageParam = 0 }) => api.fetchMusics(pageParam),
    getNextPageParam: (_, pages) => pages.length,
    staleTime: 0,
    refetchOnMount: true,
  })

  const musics: IMusic[] = useMemo(
    () => (data ? data.pages.map((page) => page.musics).flat() : []),
    [data]
  )

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

  const meta = useMemo(() => {
    if (Array.isArray(data?.pages) && data && data.pages.at(-1)?.meta)
      return data.pages.at(-1)?.meta

    return { total: 0 }
  }, [data])

  const handlePlayRandom = () => {
    setPlaylist({
      title: "tous les morceaux",
      description: "",
      id: 0,
      slug: "",
      authorId: 0,
      visibility: "public",
    })
    actions.set([...musics]?.sort(() => Math.random() - 0.5))
  }

  const handlePlayMusic = (index: number) => {
    setPlaylist({
      title: "tous les morceaux",
      description: "",
      id: 0,
      slug: "",
      authorId: 0,
      visibility: "public",
    })
    actions.set(musics, index)
  }

  const handleAddToPlaylist = async (music: IMusic) => {
    const result = await addToPlaylist.open({ music })

    if (result === "create-playlist") {
      const result = await editPlaylist.open({
        isNew: true,
        musics: [],
        initialValues: { title: "", description: "", musics: [] },
      })

      if (result.action === "success-new") {
        await handleAddToPlaylist(music)
      }
    }
  }

  const listActions = [
    [
      {
        label: "Ajouter à une playlist",
        icon: <FaList />,
        className: "text-white/90 hover:bg-white/20",
        onClick: handleAddToPlaylist,
      },
    ],
    [
      {
        label: "Lire ensuite",
        icon: <CgRowFirst />,
        className: "text-white/90 hover:bg-white/20",
        onClick: (music: IMusic) => actions.addNext(music),
      },
      {
        label: "Lire en dernier",
        icon: <CgRowFirst />,
        className: "text-white/90 hover:bg-white/20",
        onClick: (music: IMusic) => actions.addNext(music),
      },
    ],
  ]

  if (user.isAdmin) {
    listActions[0].unshift({
      label: "Supprimer",
      icon: <FaTrash />,
      className: "text-red-500 hover:bg-red-500/20",
      onClick: (music: IMusic) =>
        confirmDialog
          .open({
            message: (
              <span>
                Voulez vous supprimer la music "{music.title}" de {music.artist} <br /> Cette action
                est définitive
              </span>
            ),
          })
          .then((result) => {
            if (result)
              api
                .deleteMusic(music.id)
                .then(() => refetch())
                .catch((err) => console.log("delete failed", err))
          }),
    })
    listActions[1].unshift({
      label: "Partager",
      icon: <FaShare />,
      className: "text-white/90 hover:bg-white/20",
      onClick: async (music: IMusic) => {
        const response = await api.shareMusic(music.id)
        const result = await shareDialog.open({ link: response.link })

        result.copy && navigator.clipboard.writeText(response.link)
      },
    })
  }

  return (
    <ScrollableLayout>
      <div className="mx-4 mt-5 lg:mt-10 lg:mx-20">
        <div className="pb-5">
          <div className="flex px-3 justify-between items-center">
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
            className="px-8 py-2 font-bold flex justify-center items-center space-x-3 text-primary bg-secondary rounded-lg"
          >
            <FaPlay /> <span>Lecture</span>
          </button>
          <button
            onClick={() => handlePlayRandom()}
            className="px-8 py-2 font-bold flex justify-center items-center space-x-3 text-primary bg-secondary rounded-lg"
          >
            <IoShuffleOutline /> <span>Aléatoire</span>
          </button>
        </div>
        <div className="mt-3">
          {displayMode === DisplayMode.GRID ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-3 lg:gap-x-10 lg:gap-y-8">
              {filteredMusics.map((music) => (
                <GridItem
                  key={music.id}
                  music={music}
                  onPlay={() => handlePlayMusic(musics.findIndex((m) => m.id === music.id))}
                  actions={listActions}
                />
              ))}
              {isFetching &&
                Array.from({ length: 20 }).map((_, index) => (
                  <div key={index} className="cursor-pointer">
                    <div className="w-full">
                      <div className="w-full bg-neutral-200 animate-pulse rounded-lg">
                        <img src="/images/placeholder.png" alt="cover" className="opacity-0" />
                      </div>
                    </div>
                    <div className="bg-gray-300 animate-pulse h-3 lg:h-4 w-1/2 mt-2 rounded-lg"></div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-2 lg:gap-x-5 lg:gap-y-3">
              {filteredMusics.map((music) => (
                <MusicItem
                  key={music.id}
                  music={music}
                  onClick={() => handlePlayMusic(musics.findIndex((m) => m.id === music.id))}
                  actions={listActions}
                />
              ))}
              {isFetching &&
                Array.from({ length: 20 }).map((_, index) => <MusicSkeleton key={index} />)}
            </div>
          )}
          <div className="flex justify-center mt-16">
            {meta.total !== musics.length && (
              <button disabled={isFetching} className="btn btn-sm" onClick={() => fetchNextPage()}>
                Afficher plus
              </button>
            )}
          </div>
        </div>
      </div>
    </ScrollableLayout>
  )
}

interface ItemProps {
  music: IMusic
  onPlay: () => void
  actions: any[][]
}

const GridItem: Component<ItemProps> = ({ music, onPlay, actions }) => {
  const [isDisplay, ref] = useIsDisplay<HTMLDivElement>(0.5)

  return (
    <div ref={ref} className="cursor-pointer" onClick={handleStopPropagation(onPlay)}>
      <div className="w-full">
        <ImageLoader src={music.links.cover} enabled={isDisplay} fallback={<FallbackImage />}>
          {({ src }) => <img className="w-full rounded-lg shadow-lg" src={src} alt={music.title} />}
        </ImageLoader>
      </div>
      <div className="w-full mt-1 px-1 flex justify-between items-center space-x-2">
        <h2 className="text-white text-sm md:text-xl md:font-bold truncate w-full">
          {music.title}
          <span className="hidden lg:inline text-white/80 text-xs md:text-lg">
            {" "}
            - {music.artist}
          </span>
        </h2>
        <div>
          <MusicItemActions actions={actions} music={music} />
        </div>
      </div>
    </div>
  )
}

export default Musics
