import React from "react"
import { DialogProvider } from "react-dialog-promise"

import AuthProvider from "./auth"
import LayoutProvider from "./layout"

const ContextsProvider: ComponentWithChild = ({ children }) => {
  return (
    <AuthProvider>
      <LayoutProvider>
        <DialogProvider>{children}</DialogProvider>
      </LayoutProvider>
    </AuthProvider>
  )
}

export default ContextsProvider
