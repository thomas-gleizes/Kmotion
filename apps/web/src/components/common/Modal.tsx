import React, { memo, useId } from "react"
import ReactDom from "react-dom"
import { Transition } from "@headlessui/react"

interface Props {
  isOpen: boolean
  onOpened?: () => void
}

const Modal: ComponentWithChild<Props> = memo(({ isOpen, onOpened, children }) => {
  const portalNode = document.getElementById("portal") as Element

  const id = useId()

  if (!portalNode) return null

  const jsx = (
    <div className="absolute top-header left-0 w-full z-90">
      <Transition
        show={isOpen}
        enter="transition-all transform duration-200"
        enterFrom="translate-y-full"
        enterTo="translate-y-0"
        leave="transition-all transform duration-200"
        leaveFrom="translate-y-0"
        leaveTo="translate-y-full"
        afterEnter={onOpened}
      >
        <div id={`modal-content-${id}`} className="w-full modal-content bg-black">
          {children}
        </div>
      </Transition>
    </div>
  )

  return ReactDom.createPortal(jsx, portalNode)
})

export default Modal
