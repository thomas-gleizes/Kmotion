import React, { useEffect, useState } from "react"
import ReactDom from "react-dom"
import { Transition } from "@headlessui/react"

interface Props {
  isOpen: boolean
  close: () => void
}

const Modal: ComponentWithChild<Props> = ({ isOpen, close, children }) => {
  const [display, setDisplay] = useState(false)

  const portalNode = document.getElementById("portal") as Element

  useEffect(() => {
    if (isOpen && !display) setDisplay(true)
    else if (!isOpen && display) setTimeout(() => setDisplay(false), 1000)
  }, [isOpen, display])

  useEffect(() => console.log("IsOpen, display", isOpen, display), [isOpen, display])

  if (!isOpen && !display) return null

  const jsx = (
    <div className="absolute h-full">
      <Transition show={true}>{children}</Transition>
    </div>
  )

  return ReactDom.createPortal(jsx, portalNode)
}

export default Modal
