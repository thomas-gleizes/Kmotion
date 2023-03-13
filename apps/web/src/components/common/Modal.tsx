import React, { memo } from "react"
import ReactDom from "react-dom"
import { Transition } from "@headlessui/react"

interface Props {
  isOpen: boolean
}

const Modal: ComponentWithChild<Props> = memo(({ isOpen, children }) => {
  const portalNode = document.getElementById("portal") as Element

  if (!portalNode) return null

  const jsx = (
    <div className="absolute top-[36px] left-0 w-full z-90">
      <Transition
        show={isOpen}
        enter="transition-all transform duration-200"
        enterFrom="translate-y-full"
        enterTo="translate-y-0"
        leave="transition-all transform duration-200"
        leaveFrom="translate-y-0"
        leaveTo="translate-y-full"
      >
        <div className="w-full h-[635px] bg-black">{children}</div>
      </Transition>
    </div>
  )

  return ReactDom.createPortal(jsx, portalNode)
})

export default Modal
