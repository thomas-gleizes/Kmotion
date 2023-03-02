import React from "react"
import AuthProvider from "./auth"

const ContextsProvider: ComponentWithChild = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>
}

export default ContextsProvider
