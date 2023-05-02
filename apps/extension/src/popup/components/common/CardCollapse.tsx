import React from "react"
import { FaMinus, FaPlus } from "react-icons/all"
import { useToggle } from "react-use"
import { Transition } from "@headlessui/react"

interface Props {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

const CardCollapse: React.FC<Props> = ({ title, children, defaultOpen }) => {
  const [open, toggle] = useToggle(typeof defaultOpen === "undefined" ? true : defaultOpen)

  return (
    <div data-open={open} className="border mb-2 rounded-lg shadow-md">
      <div className="px-2 py-1 flex justify-between">
        <h2 className="text-lg">{title}</h2>
        <button
          onClick={toggle}
          className="transition transform hover:text-blue-700 hover:scale-105 duration-150 p-1.5"
        >
          {open ? <FaMinus /> : <FaPlus />}
        </button>
      </div>
      <Transition
        show={open}
        enter="transition transform duration-1000"
        enterFrom="opacity-0 -translate-y-10"
        enterTo="opacity-100 translate-y-0"
        leave="transition-opacity duration-400"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="border-t bg-white px-3 py-2">{children}</div>
      </Transition>
    </div>
  )
}

export default CardCollapse
