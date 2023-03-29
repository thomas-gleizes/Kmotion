import React from "react"
import AuthProvider from "./auth"
import LayoutProvider from "./layout"
import ModalProvider from "./modals"

const ContextsProvider: ComponentWithChild = ({ children }) => {
  return (
    <AuthProvider>
      <LayoutProvider>
        <ModalProvider>{children}</ModalProvider>
      </LayoutProvider>
    </AuthProvider>
  )
}

export default ContextsProvider
