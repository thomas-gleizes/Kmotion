import React from "react"
import { DialogComponent } from "react-dialog-promise"
import { Dialog } from "@headlessui/react"

import SimpleDialog from "../common/SimpleDialog"

interface Props {
  link: string
}

interface Result {
  copy: boolean
}

const SharedMusic: DialogComponent<Props, Result> = ({ isOpen, close, link }) => {
  return (
    <SimpleDialog isOpen={isOpen} onClose={() => close({ copy: false })}>
      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-white">
        Voici le liens de partage valable 4h
      </Dialog.Title>
      <div className="mt-5">
        <div>
          <p className="text-sm text-white">{link}</p>
        </div>
      </div>
      <div className="flex justify-between w-full mt-8">
        <button
          type="button"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          onClick={() => close({ copy: true })}
        >
          Copie dans le presse papier
        </button>
        <button
          type="button"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          onClick={() => close({ copy: false })}
        >
          Ok
        </button>
      </div>
    </SimpleDialog>
  )
}

export default SharedMusic
