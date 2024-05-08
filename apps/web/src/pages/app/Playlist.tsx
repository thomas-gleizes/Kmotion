import React, { useMemo, useState } from "react"
import { Link, useParams } from "@tanstack/react-router"
import { useQuery, useQueryClient, queryOptions } from "@tanstack/react-query"
import { useDialog } from "react-dialog-promise"
import { FaChevronLeft, FaList, FaPlay, FaSearch, FaTrash } from "react-icons/fa"
import { CgRowFirst } from "react-icons/cg"
import { IoShuffleOutline } from "react-icons/io5"

import { IMusic, IPlaylist, IPlaylistEntry } from "@kmotion/types"
import { api } from "../../utils/Api"
import { useAuthenticatedContext } from "../../contexts/auth"
import { usePlayerContext } from "../../contexts/player"
import PlaylistGridImage from "../../components/common/PlaylistGridImage"
import ScrollableLayout from "../../components/layouts/ScrollableLayout"
import EditPlaylist from "../../components/modals/EditPlaylist"
import { MusicsList } from "../../components/common/Music/List"
import AddToPlaylist from "../../components/modals/AddToPlaylist"
import ConfirmDialog from "../../components/modals/ConfirmDialog"

export const playlistQueryOptions = (id: number) =>
  queryOptions<IPlaylist>({
    queryKey: ["playlist", id],
    queryFn: () => api.fetchPlaylist(+id, false).then((data) => data.playlist),
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
  })

export const entriesQueryOptions = (id: number) =>
  queryOptions<IPlaylistEntry[]>({
    queryKey: ["playlist-entries", id],
    queryFn: () => api.fetchEntries(+id, true).then((data) => data.entries),
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
  })

const Playlist: Page = () => {
  const { id } = useParams({ from: "/app/playlist/$id" })
  const { user } = useAuthenticatedContext()

  const {
    actions,
    playlist: { set: setPlaylist },
  } = usePlayerContext()

  const queryClient = useQueryClient()

  const editPlaylist = useDialog(EditPlaylist)
  const addToPlaylist = useDialog(AddToPlaylist)
  const confirmDialog = useDialog(ConfirmDialog)

  const [querySearch, setQuerySearch] = useState("")

  const { data: playlist, refetch: refetchPlaylist } = useQuery(playlistQueryOptions(+id))

  const entriesQuery = useQuery(entriesQueryOptions(+id))

  const entries: IPlaylistEntry[] = entriesQuery.data || []

  const filteredEntries = useMemo<IPlaylistEntry[]>(
    () =>
      querySearch.length > 0
        ? entries.filter(
            (entry) =>
              entry.music &&
              (entry.music.title.toLowerCase().includes(querySearch.toLowerCase()) ||
                entry.music.artist.toLowerCase().includes(querySearch.toLowerCase())),
          )
        : [...entries],
    [entries, querySearch],
  )

  const handlePlayPlaylist = (random: boolean) => {
    setPlaylist(playlist as IPlaylist)
    if (random)
      actions.set(
        [...entries]?.sort(() => Math.random() - 0.5).map((entry) => entry.music as IMusic),
      )
    else actions.set(entries?.map((entry) => entry.music as IMusic))
  }

  const handlePlayMusic = (index: number) => {
    setPlaylist(playlist as IPlaylist)
    actions.set(entries?.map((entry) => entry.music as IMusic), index)
  }

  const handleEditPlaylist = async () => {
    if (!playlist) return null

    const result = await editPlaylist.open({
      isNew: false,
      musics: entries.map((entry) => entry.music as IMusic),
      initialValues: {
        id: playlist.id,
        title: playlist.title,
        description: playlist.description,
        musics: entries.map((entry) => entry.musicId),
      },
    })

    if (result.action !== "cancel")
      await Promise.all([
        refetchPlaylist(),
        entriesQuery.refetch(),
        queryClient.resetQueries({ queryKey: ["playlists", id], exact: true }),
      ])
  }

  const time = useMemo<{ hours: number; minutes: number }>(() => {
    const seconds = entries.reduce(
      (acc, entry) => (entry.music ? acc + (entry.music as IMusic).duration : 0),
      0,
    )

    return {
      hours: Math.floor(seconds / 3600),
      minutes: Math.floor((seconds % 3600) / 60),
    }
  }, [entries])

  if (!playlist) return null

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
        label: "Supprimer de la playlist",
        icon: <FaTrash />,
        className: "text-primary hover:bg-primary/30",
        onClick: async (music: IMusic) =>
          api
            .removeMusicFromPlaylist({ id: playlist.id, musicId: music.id })
            .then(() => entriesQuery.refetch()),
      },
      {
        label: "Ajouter à une playlist",
        icon: <FaList />,
        className: "hover:bg-white/30",
        onClick: handleAddToPlaylist,
      },
    ],
    [
      {
        label: "Lire ensuite",
        icon: <CgRowFirst />,
        className: "text-white/80 hover:bg-white/30",
        onClick: (music: IMusic) => actions.addNext(music),
      },
      {
        label: "Lire en dernier",
        icon: <CgRowFirst />,
        className: "text-white/80 hover:bg-white/30",
        onClick: (music: IMusic) => actions.addNext(music),
      },
    ],
  ]

  if (user.isAdmin)
    listActions[0].unshift({
      label: "Supprimer",
      icon: <FaTrash />,
      className: "text-red-500 hover:bg-red-500/30",
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
                .then(() => entriesQuery.refetch())
                .catch((err) => console.log("delete failed", err))
          }),
    })

  return (
    <div className="relative">
      <div className="absolute z-30 lg:hidden top-0 left-0 w-full py-3 bg-secondary/70 backdrop-blur">
        <div className="flex justify-between px-3">
          <Link to="/app/playlists">
            <FaChevronLeft className="text-primary text-xl" onClick={() => null} />
          </Link>
          <button onClick={handleEditPlaylist} className="text-primary">
            Modifier
          </button>
        </div>
      </div>
      <ScrollableLayout>
        <div className="px-3 mt-8">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:sticky lg:h-full lg:top-10 lg:bottom-0 lg:w-1/3 flex flex-col lg:justify-center space-y-3">
              <div className="h-[200px] w-[200px] lg:w-[300px] lg:h-[300px] xl:w-[420px] xl:h-[420px] mx-auto mt-10">
                <PlaylistGridImage ids={entries.map((entry) => entry.musicId)} />
              </div>
              <div className="">
                <h3 className="text-center font-semibold text-2xl text-white">{playlist.title}</h3>
                <p className="text-white/50 mx-auto w-11/12 lg:text-center">
                  {playlist.description}
                </p>
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
              <div className="mt-3 px-2 flex justify-center w-full">
                <div className="flex items-center space-x-3 bg-secondary-light py-1 px-2 rounded-lg w-full max-w-[500px]">
                  <FaSearch className="text-white/70" />
                  <input
                    type="search"
                    value={querySearch}
                    onChange={(e) => setQuerySearch(e.target.value)}
                    className="bg-transparent placeholder:text-white/70 text-white w-full"
                    placeholder="Rechercher un morceau dans la playlist..."
                  />
                </div>
              </div>
            </div>
            <div className="lg:w-2/3 lg:px-5 py-1 mt-2">
              <div className="text-white/90">
                {entries.length} morceaux, {time.hours} heure{time.hours > 1 && "s"} et{" "}
                {time.minutes} minute{time.minutes > 1 && "s"}
              </div>
              <div className="border-t py-2 border-white/75">
                <MusicsList
                  musics={filteredEntries.map((entry) => entry.music as IMusic)}
                  loading={entriesQuery.isLoading}
                  actions={listActions}
                  onClick={(music) =>
                    handlePlayMusic(entries.findIndex((e) => e.musicId === music.id))
                  }
                />
              </div>
              <div className="pt-1">
                <p className="text-white text-sm text-opacity-80">
                  {entries.length} morceaux, {time.hours} heure{time.hours > 1 && "s"} et{" "}
                  {time.minutes} minute{time.minutes > 1 && "s"}{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </ScrollableLayout>
    </div>
  )
}

export default Playlist
