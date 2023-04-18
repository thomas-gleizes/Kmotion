import React, { Fragment, useState } from "react"
import { DialogComponent } from "react-dialog-promise"
import { useQuery } from "@tanstack/react-query"
import { Dialog, Listbox, Transition } from "@headlessui/react"

import { IMusic, IPlaylist } from "@kmotion/types"
import { QUERIES_KEY } from "../../utils/constants"
import { useAuthenticatedContext } from "../../contexts/auth"
import SimpleDialog from "../common/SimpleDialog"
import { api } from "../../utils/Api"
import { FaCheck, FaChevronUp, FaSpinner } from "react-icons/all"
import classnames from "classnames"

interface Props {
  music: IMusic
}

interface Result {}

const AddToPlaylist: DialogComponent<Props, Result> = ({ isOpen, close, music }) => {
  const { user } = useAuthenticatedContext()

  const { data: playlists, isLoading } = useQuery<IPlaylist[]>({
    queryKey: [...QUERIES_KEY.playlists, user.id],
    queryFn: () => api.fetchPlaylists(false).then((response) => response.playlists),
    initialData: [],
  })

  const [selected, setSelected] = useState<IPlaylist>()

  return (
    <SimpleDialog isOpen={isOpen} onClose={() => close({})}>
      <div className="max-w-[400px]">
        <Dialog.Title className="text-white text-xl font-semibold">
          Ajouter {music.title} a une playlist
        </Dialog.Title>
        {isLoading ? (
          <div>
            <FaSpinner className="text-primary text-xl animate-spin" />
          </div>
        ) : (
          <div>
            <Listbox value={selected} onChange={setSelected}>
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
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute bg-secondary-light/80 text-white mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {playlists.map((playlist, index) => (
                      <Listbox.Option
                        key={index}
                        className={({ active }) =>
                          classnames(
                            "relative cursor-default select-none py-2 pl-10 pr-4 text-white",
                            active
                              ? "bg-primary/70"
                              : "bg-transparent hover:bg-primary-light/90 transition"
                          )
                        }
                        value={playlist}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
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
              <button>Cancel</button>
              <button>Ajouter</button>
            </div>
          </div>
        )}
      </div>
    </SimpleDialog>
  )
}

export default AddToPlaylist
