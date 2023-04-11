import React, { useEffect, useMemo, useRef, useState } from "react"
import { FaCheckCircle, FaMinusCircle, FaPlusCircle, FaSearch } from "react-icons/all"
import { useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import SimpleBar from "simplebar-react"

import { IMusic, IPlaylist } from "@kmotion/types"
import { CreatePlaylistDto, UpdatePlaylistDto } from "@kmotion/validations"
import { api } from "../../utils/Api"
import { QUERIES_KEY } from "../../utils/constants"
import { useModalContext } from "../../contexts/modals"
import Modal from "../common/Modal"
import ImageLoader from "../common/ImageLoader"
import PlaylistGridImage from "../common/PlaylistGridImage"

type Props =
  | {
      isNew: false
      musics: IMusic[]
      initialValues: CreatePlaylistDto
    }
  | {
      isNew: true
      initialValues: UpdatePlaylistDto
      musics: IMusic[]
    }

type Result =
  | {
      action: "cancel"
    }
  | {
      action: "success-new" | "success-edit"
      playlist: IPlaylist
    }

const EditPlaylist: ModalComponent<Props, Result> = ({
  isOpen,
  close,
  isNew,
  initialValues,
  musics: initMusics = [],
}) => {
  const { register, handleSubmit, setValue, getValues } = useForm<typeof initialValues>({
    defaultValues: isNew ? { title: "", description: "", musics: [] } : initialValues,
  })

  const [musics, setMusics] = useState<IMusic[]>(initMusics)

  const { open } = useModalContext()

  const handleSearchMusic = async () => {
    const result = await open<SearchResult>(<SearchPlaylist />)

    if (result.action === "success") {
      setValue("musics", [...(getValues().musics || []), ...result.data.map((m) => m.id)])
      setMusics([...musics, ...result.data])
    }
  }

  const onSubmitNew = async (values: CreatePlaylistDto) => {
    try {
      const data = await api.createPlaylist(values)
      console.log("Data", data)
      close({ action: "success", playlist: data.playlist })
    } catch (err) {
      console.error(err)
    }
  }

  const onSubmitEdit = async (values: UpdatePlaylistDto) => {
    try {
      const data = await api.updatePlaylist(values.id, values)
      console.log("Data", data)
      close({ action: "success", playlist: data.playlist })
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteMusic = (music: IMusic) => {
    const index = musics.findIndex((m) => m.id === music.id)
    if (index >= 0) {
      musics.splice(index, 1)
      setMusics([...musics])
    }

    const idsMusic = getValues().musics || []
    const index2 = idsMusic.findIndex((id) => id === music.id)
    if (index2 >= 0) {
      idsMusic.splice(index2, 1)
      setValue("musics", idsMusic)
    }
  }

  const time = useMemo<{ hours: number; minutes: number }>(() => {
    const seconds = musics.reduce((acc, m) => acc + m.duration, 0)

    return {
      hours: Math.floor(seconds / 3600),
      minutes: Math.floor((seconds % 3600) / 60),
    }
  }, [musics])

  return (
    <Modal isOpen={isOpen}>
      <form onSubmit={handleSubmit(isNew ? onSubmitNew : onSubmitEdit)}>
        <div className="absolute z-[50] w-full bg-secondary/80 backdrop-blur py-2">
          <div className="flex justify-between items-center py-1 px-3">
            <button
              type="button"
              className="text-red-600"
              onClick={() => close({ action: "cancel" })}
            >
              Annuler
            </button>
            <div className="text-white">Nouvelle playlist</div>
            <button type="submit" className="text-red-600">
              Valider
            </button>
          </div>
        </div>
        <SimpleBar className="h-[calc(100vh-17px)]">
          <div className="pt-24 px-5 pb-footer">
            <div className="w-[150px] h-[150px] mx-auto">
              <PlaylistGridImage ids={musics.map((m) => m.id)} />
            </div>
            <div className="py-2 text-center pt-8">
              <input
                type="text"
                className="bg-transparent outline:none text-center text-xl text-white placeholder:text-neutral-600"
                placeholder="Nom de la playlist"
                {...register("title")}
              />
            </div>
            <div className="border-y py-4 border-neutral-500 mt-2">
              <textarea
                rows={1}
                className="bg-transparent outline:none w-full text-base text-neutral-400 placeholder:text-neutral-600"
                placeholder="Description"
                {...register("description")}
              />
            </div>
            <div className="text-white/70 mt-1">
              {musics.length} morceaux, {time.hours} heure{time.hours > 1 && "s"} et {time.minutes}{" "}
              minute{time.minutes > 1 && "s"}
            </div>
            <div className="flex flex-col w-full space-y-2 mt-5">
              <div className="flex items-center cursor-pointer pb-2" onClick={handleSearchMusic}>
                <div className="pr-3">
                  <FaPlusCircle className="text-red-800 text-xl" />
                </div>
                <div className="text-white">Ajouter un music à la playlist</div>
              </div>
              {(musics || []).map((music, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-[23%]">
                    <ImageLoader src={music.links.cover}>
                      {({ src }) => <img alt={music.title} src={src} className="rounded-lg" />}
                    </ImageLoader>
                  </div>
                  <div className="w-[77%] px-2">
                    <div className="border-white border-b flex justify-between items-center h-full">
                      <div className="w-max pb-1 truncate">
                        <h3 className="text-base text-white truncate">{music.title}</h3>
                        <p className="text-xs text-white/75">{music.artist}</p>
                      </div>
                      <div onClick={() => handleDeleteMusic(music)}>
                        <FaMinusCircle className="text-xl text-red-600" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SimpleBar>
      </form>
    </Modal>
  )
}

declare type SearchResult =
  | {
      action: "cancel"
    }
  | {
      action: "success"
      data: IMusic[]
    }

const SearchPlaylist: ModalComponent<never, SearchResult> = ({ isOpen, close }) => {
  const [search, setSearch] = useState("")

  const inputRef = useRef<HTMLInputElement>(null)

  const { data: musics } = useQuery<IMusic[]>({
    queryKey: [...QUERIES_KEY.musics_search, search],
    queryFn: () => api.searchMusics(search).then((data) => data.musics),
    enabled: search.length >= 3,
    initialData: [],
    staleTime: 0,
  })

  useEffect(() => {
    if (!isOpen) {
      setSearch("")
      setSelectedMusics([])
    }
  }, [isOpen])

  const [selectedMusics, setSelectedMusics] = useState<IMusic[]>([])

  const toggleCheck = (music: IMusic) => {
    const index = selectedMusics.findIndex((m) => m.id === music.id)
    if (index < 0) setSelectedMusics([...selectedMusics, music])
    else {
      selectedMusics.splice(index, 1)
      setSelectedMusics([...selectedMusics])
    }
  }

  const musicsChecked = useMemo<number[]>(() => selectedMusics.map((m) => m.id), [selectedMusics])

  return (
    <Modal isOpen={isOpen} afterOpen={() => inputRef.current?.focus()}>
      <div className="bg-secondary-dark">
        <p className="text-white/90 text-sm text-center py-0.5">
          {musicsChecked.length} morceaux ajoutés a "nouvelle playlist"
        </p>
      </div>
      <div className="bg-secondary py-1.5">
        <div className="flex justify-between items-center py-1 px-3">
          <button
            type="button"
            className="text-red-600"
            onClick={() => close({ action: "cancel" })}
          >
            Annuler
          </button>
          <div className="text-white">Recherche des morceaux</div>
          <button
            type="submit"
            className="text-red-600"
            onClick={() => close({ action: "success", data: selectedMusics })}
          >
            Valider
          </button>
        </div>
      </div>
      <div className="py-2">
        <div className="flex items-center space-x-2 py-1 text-white/90 group rounded-lg bg-secondary mx-4 px-3 my-2 transition">
          <FaSearch className="text-xl" />
          <input
            ref={inputRef}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="bg-transparent w-full px-1 text-xl placeholder:text-white/70"
            placeholder="Rechercher des Morceau"
          />
        </div>
        <SimpleBar className="h-[calc(100vh-96px)] pb-footer">
          <div className="flex flex-col space-y-2 px-4 pb-24">
            {musics.map((music, index) => (
              <div key={index} className="w-full py-0.5 flex" onClick={() => toggleCheck(music)}>
                <div className="w-1/5">
                  <ImageLoader src={music.links.cover}>
                    {({ src }) => <img src={src} alt={music.title} className="rounded-lg w-full" />}
                  </ImageLoader>
                </div>
                <div className="w-4/5 px-3">
                  <div className="flex items-center justify-between h-full pl-2 border-white/50 border-b">
                    <div className="w-max pb-1 truncate">
                      <h3 className="text-base truncate text-white">{music.title}</h3>
                      <p className="text-xs text-white/75">{music.artist}</p>
                    </div>
                    <div className="w-min text-primary pl-2">
                      {!musicsChecked.includes(music.id) ? (
                        <FaPlusCircle />
                      ) : (
                        <FaCheckCircle className="text-green-600" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SimpleBar>
      </div>
    </Modal>
  )
}

export default EditPlaylist
