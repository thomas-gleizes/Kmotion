import React from "react"
import { DialogProvider } from "react-dialog-promise"

import AuthProvider from "./auth"

const ContextsProvider: ComponentWithChild = ({ children }) => {
  return (
    <AuthProvider>
      <DialogProvider>{children}</DialogProvider>
    </AuthProvider>
  )
}

export default ContextsProvider
