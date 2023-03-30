import React, { createContext, useState } from "react"

import { ModalsContextValues } from "../../types/contexts"
import { useContextFactory } from "../hooks"
import { MODAL } from "../utils/constants"

const ModalsContext = createContext<ModalsContextValues>(null as never)

export const useModalContext = useContextFactory(ModalsContext)

const ModalProvider: ComponentWithChild = ({ children }) => {
  const [modals, setModals] = useState<ModalType[]>([])

  const open = (modal: ModalType) => setModals([...modals, modal])

  const close = (uid: string) => {
    const index = modals.findIndex((d) => d.uid === uid)
    setModals([...modals.slice(0, index), ...modals.slice(index + 1)])
  }

  return (
    <ModalsContext.Provider value={{ open, close }}>
      {children}
      {modals.map((modal) => (
        <ModalContainer key={modal.uid} {...modal} />
      ))}
    </ModalsContext.Provider>
  )
}

type Props = {
  component: JSX.Element
  uid: string
  resolve: (result: unknown) => void
}

const ModalContainer: Component<Props> = ({ uid, component: Component, resolve }) => {
  const context = useModalContext()

  const [isOpen, setIsOpen] = useState<boolean>(true)

  const handleClose = (result: unknown) => {
    resolve(result)
    setIsOpen(false)

    window.setTimeout(() => context.close(uid), MODAL.defaultTimeout)
  }

  return React.cloneElement(Component, { isOpen, close: handleClose })
}

export default ModalProvider
