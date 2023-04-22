import React from "react"
import { DialogComponent } from "react-dialog-promise"
import { Dialog } from "@headlessui/react"

import SimpleDialog from "../common/SimpleDialog"

interface Props {
  title?: ReactNode | string
  message: ReactNode | string
}

const ConfirmDialog: DialogComponent<Props, boolean> = ({ isOpen, close, title, message }) => {
  return (
    <SimpleDialog isOpen={isOpen} onClose={() => close(false)}>
      <Dialog.Title className="text-2xl text-white font-semibold mb-4">
        {title || "Veuillez confirmer"}
      </Dialog.Title>
      <Dialog.Description className="text-lg mb-4">{message}</Dialog.Description>
      <div className="w-full flex justify-between">
        <button
          onClick={() => close(false)}
          className="btn border border-white bg-secondary hover:border-primary text-white hover:text-primary"
        >
          Annuler
        </button>
        <button
          onClick={() => close(true)}
          className="btn border bg-secondary border-primary text-primary"
        >
          Confirmer
        </button>
      </div>
    </SimpleDialog>
  )
}

export default ConfirmDialog
