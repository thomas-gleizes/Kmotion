import React, { memo } from "react"
import ReactDom from "react-dom"
import { Transition } from "@headlessui/react"

interface Props {
  isOpen: boolean
  afterOpen?: () => void
  beforeOpen?: () => void
  beforeClose?: () => void
  afterClose?: () => void
}

const Modal: ComponentWithChild<Props> = memo(
  ({ isOpen, children, afterOpen, beforeOpen, beforeClose, afterClose }) => {
    const container = document.getElementById("portal") as Element

    if (!container) return null

    const element = (
      <div className="absolute top-header left-0 w-full z-90">
        <Transition
          show={isOpen}
          enter="transition-all transform duration-200"
          enterFrom="translate-y-full"
          enterTo="translate-y-0"
          leave="transition-all transform duration-200"
          leaveFrom="translate-y-0"
          leaveTo="translate-y-full"
          beforeEnter={beforeOpen}
          afterEnter={afterOpen}
          beforeLeave={beforeClose}
          afterLeave={afterClose}
        >
          <div className="w-full modal-content bg-black">{children}</div>
        </Transition>
      </div>
    )

    return ReactDom.createPortal(element, container)
  }
)

export default Modal
