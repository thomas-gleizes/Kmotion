import React from "react"
import { FaPlusCircle } from "react-icons/all"

import Modal from "../common/Modal"
import PlaylistGridImage from "../common/PlaylistGridImage"

interface Props {}

const CreatePlaylist: ModalComponent<Props> = ({ isOpen, close }) => {
  return (
    <Modal isOpen={isOpen}>
      <form>
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
          <div className="w-[200px] h-[200px] mx-auto">
            <PlaylistGridImage ids={[]} />
          </div>
          <div className="py-2 text-center pt-8">
            <input
              type="text"
              className="bg-transparent outline:none text-center text-xl text-white placeholder:text-neutral-600"
              placeholder="Nom de la playlist"
            />
          </div>
          <div className="border-y py-4 border-neutral-500 my-5">
            <textarea
              rows={1}
              className="bg-transparent outline:none w-full text-base text-neutral-400 placeholder:text-neutral-600"
              placeholder="Description"
            />
          </div>
          <div className="flex flex-col w-full pb-16">
            <div className="flex items-center space-x-4 cursor-pointer">
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
    </Modal>
  )
}

export default CreatePlaylist
