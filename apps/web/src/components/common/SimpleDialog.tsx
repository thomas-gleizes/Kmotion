import React, { Fragment, useEffect, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { createPortal } from "react-dom"

interface Props {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

const SimpleDialog: Component<Props> = ({ isOpen, onClose, children }) => {
  const container = document.getElementById("portal") as HTMLElement

  const [isRender, setIsRender] = useState(false)

  useEffect(() => {
    if (isOpen) setIsRender(true)
    else setTimeout(() => setIsRender(false), 200)
  }, [isOpen])

  if (!isRender) return null

  return createPortal(
    <Transition appear show={isOpen}>
      <Dialog as="div" className="relative z-100" onClose={onClose}>
        <Transition.Child
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-fit transform rounded-2xl bg-secondary-dark/90 backdrop-blur-3xl p-6 text-left align-middle shadow-xl transition-all">
                <>{children}</>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>,
    container,
  )
}

export default SimpleDialog
