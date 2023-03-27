import React, { useEffect, useMemo, useRef, useState } from "react"
import { FaCheckCircle, FaPlusCircle, FaSearch } from "react-icons/all"
import { useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import SimpleBar from "simplebar-react"

import { IMusic } from "@kmotion/types"
import { CreatePlaylistDto } from "@kmotion/validations"
import { api } from "../../utils/Api"
import Modal from "../common/Modal"
import ImageLoader from "../common/ImageLoader"
import PlaylistGridImage from "../common/PlaylistGridImage"

const CreatePlaylist: ModalComponent = ({ isOpen, close }) => {
  const [openSearch, setOpenSearch] = useState(false)
  const { register, handleSubmit, setValue, getValues } = useForm<CreatePlaylistDto>({
    defaultValues: { title: "", description: "", musics: [] },
  })

  const handleConfirm = (musicsId: IMusic[]) => {
    const { musics } = getValues()

    setValue("musics", [...(musics || []), ...musicsId.map((m) => m.id)])
    setOpenSearch(false)
  }

  const onSubmit = (values: CreatePlaylistDto) => {
    try {
      const data = api.createPlaylist(values)
      console.log("Daat", data)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Modal isOpen={isOpen}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="absolute w-full bg-secondary py-2">
          <div className="flex justify-between items-center py-1 px-3">
            <button type="button" className="text-red-600" onClick={close}>
              Annuler
            </button>
            <div className="text-white">Nouvelle playlist</div>
            <button type="submit" className="text-red-600">
              Valider
            </button>
          </div>
        </div>
        <div className="pt-24 px-5">
          <div className="w-[150px] h-[150px] mx-auto">
            <PlaylistGridImage ids={[]} />
          </div>
          <div className="py-2 text-center pt-8">
            <input
              type="text"
              className="bg-transparent outline:none text-center text-xl text-white placeholder:text-neutral-600"
              placeholder="Nom de la playlist"
              {...register("title")}
            />
          </div>
          <div className="border-y py-4 border-neutral-500 my-5">
            <textarea
              rows={1}
              className="bg-transparent outline:none w-full text-base text-neutral-400 placeholder:text-neutral-600"
              placeholder="Description"
              {...register("description")}
            />
          </div>
          <div className="flex flex-col w-full pb-16">
            <div
              className="flex items-center space-x-4 cursor-pointer"
              onClick={() => setOpenSearch(true)}
            >
              <div>
                <FaPlusCircle className="text-red-800 text-xl" />
              </div>
              <div className="text-white">Ajouter un music à la playlist</div>
            </div>
            {[].map((music) => (
              <div className="flex items-center space-x-4">
                <div>
                  <FaPlusCircle className="text-red-800 text-xl" />
                </div>
                <div className="text-white">Ajouter un music à la playlist</div>
              </div>
            ))}
          </div>
        </div>
      </form>
      <ModalSearch isOpen={openSearch} close={() => setOpenSearch(false)} confirm={handleConfirm} />
    </Modal>
  )
}

const ModalSearch: ModalComponent<{ confirm: (musics: IMusic[]) => void }> = ({
  isOpen,
  close,
  confirm,
}) => {
  const [search, setSearch] = useState("")

  const inputRef = useRef<HTMLInputElement>(null)

  const { data: musics } = useQuery<IMusic[]>({
    queryKey: ["search-musics", search],
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
    <Modal isOpen={isOpen} onOpened={() => inputRef.current?.focus()}>
      <div className="bg-secondary-dark">
        <p className="text-white/90 text-sm text-center py-0.5">
          {musicsChecked.length} morceaux ajoutés a "nouvelle playlist"
        </p>
      </div>
      <div className="bg-secondary py-1.5">
        <div className="flex justify-between items-center py-1 px-3">
          <button type="button" className="text-red-600" onClick={close}>
            Annuler
          </button>
          <div className="text-white">Recherche des morceaux</div>
          <button type="submit" className="text-red-600" onClick={() => confirm(selectedMusics)}>
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
        <SimpleBar className="max-h-[74vh] pb-footer">
          <div className="flex flex-col space-y-2 px-4">
            {musics.map((music) => (
              <div key={music.id} className="w-full py-0.5 flex" onClick={() => toggleCheck(music)}>
                <div className="w-1/5">
                  <ImageLoader src={music.links.cover}>
                    {({ src }) => <img src={src} alt={music.title} className="rounded-lg w-full" />}
                  </ImageLoader>
                </div>
                <div className="w-4/5 px-3">
                  <div className="flex items-center justify-between h-full pl-2 border-white/50 border-b">
                    <div className="w-max pb-1">
                      <h3 className="text-base text-white">{music.title}</h3>
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

export default CreatePlaylist
