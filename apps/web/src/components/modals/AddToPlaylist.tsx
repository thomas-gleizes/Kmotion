import React, { useMemo } from "react"
import { DialogComponent } from "react-dialog-promise"
import { useQuery } from "@tanstack/react-query"
import { Dialog, Listbox, Transition } from "@headlessui/react"
import classnames from "classnames"
import { FaCheck, FaChevronUp, FaSpinner } from "react-icons/fa"
import { useForm } from "react-hook-form"
import { classValidatorResolver } from "@hookform/resolvers/class-validator"

import { IMusic, IPlaylist } from "@kmotion/types"
import { AddMusicToPlaylistDto } from "@kmotion/validations"
import { useAuthenticatedContext } from "../../contexts/auth"
import SimpleDialog from "../common/SimpleDialog"
import { api } from "../../utils/Api"
import { toast } from "react-toastify"
import { queryClient } from "../../queryClient"

interface Props {
  music: IMusic
}

type Result = "success" | "cancel" | "create-playlist"

const resolver = classValidatorResolver(AddMusicToPlaylistDto)

const AddToPlaylist: DialogComponent<Props, Result> = ({ isOpen, close, music }) => {
  const { user } = useAuthenticatedContext()

  const { data: playlists, isLoading } = useQuery<IPlaylist[]>({
    queryKey: ["playlists", user.id],
    queryFn: () => api.fetchPlaylists(false).then((response) => response.playlists),
    placeholderData: [],
  })

  const filteredPlaylists = useMemo(() => {
    if (!playlists) return []

    return playlists.filter((playlist) => {
      if (playlists.entries === undefined) return true

      return !(playlist.entries || []).find((entry) => entry.musicId === music.id)
    })
  }, [playlists, music])

  const {
    watch,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<AddMusicToPlaylistDto>({
    resolver,
    defaultValues: { musicId: music.id },
  })

  const selectedId = watch("id")

  const selected = useMemo<IPlaylist | null>(() => {
    if (!selectedId || !playlists) return null
    return playlists.find((playlist) => playlist.id === selectedId) || null
  }, [selectedId, playlists])

  const submit = async (values: AddMusicToPlaylistDto) => {
    try {
      await api.addMusicToPlaylist(values)

      // invalidé le cache des playlsts de l'utilisateur pour les prochaines ajout prenne en compte la modification
      void queryClient.invalidateQueries({ queryKey: ["playlists", user.id] })

      close("success")
    } catch (e) {
      toast.error("Une erreur est survenue lors de l'ajout de la musique à la playlist")
    }
  }

  return (
    <SimpleDialog isOpen={isOpen} onClose={() => !isSubmitting && close("cancel")}>
      <div className="max-w-[400px]">
        <Dialog.Title className="text-white text-xl font-semibold">
          Ajouter <span className="text-primary font-semibold">{music.title}</span> a une playlist
        </Dialog.Title>
        {isLoading ? (
          <div>
            <FaSpinner className="text-primary text-xl animate-spin" />
          </div>
        ) : filteredPlaylists?.length ? (
          <form onSubmit={handleSubmit(submit)}>
            <Listbox value={selectedId} onChange={(value) => setValue("id", value)}>
              <div className="relative mt-1">
                <Listbox.Button className="relative text-white bg-secondary-dark w-full cursor-default rounded-lg py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate">
                    {selected?.title || "Chosisez une playlist"}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <FaChevronUp className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </Listbox.Button>
                <Transition
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute bg-secondary-light text-white mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredPlaylists.map((playlist, index) => (
                      <Listbox.Option
                        key={index}
                        value={playlist.id}
                        className={({ active }) =>
                          classnames(
                            "relative cursor-default select-none py-2 pl-10 pr-4 text-white",
                            active ? "bg-primary/50" : "hover:bg-primary-light/90 transition",
                          )
                        }
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={classnames(
                                "block truncate",
                                selected ? "font-medium" : "font-normal",
                              )}
                            >
                              {playlist.title}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                <FaCheck className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
            <div className="flex justify-between items-center mt-8">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                onClick={() => close("cancel")}
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                disabled={selected === undefined || isSubmitting}
              >
                Ajouter
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-2">
            <Dialog.Description className="text-white text-center">
              Vous n'avez pas de playlist
            </Dialog.Description>
            <div className="flex justify-between items-center mt-8">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                onClick={() => close("cancel")}
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                disabled={selected === undefined || isSubmitting}
                onClick={() => close("create-playlist")}
              >
                Créer une playlist
              </button>
            </div>
          </div>
        )}
      </div>
    </SimpleDialog>
  )
}

export default AddToPlaylist
