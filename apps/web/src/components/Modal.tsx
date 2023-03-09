import React, { useEffect, useState } from "react"
import ReactDom from "react-dom"
import classnames from "classnames"

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
    <div
      onClick={close}
      className={classnames(
        "absolute top-0 h-full bg-red-500 w-full z-90 transition-all transform duration-1000",
        {
          "-translate-y-1/2": isOpen,
        }
      )}
    >
      <div>{children}</div>
    </div>
  )

  return ReactDom.createPortal(jsx, portalNode)
}

export default Modal
