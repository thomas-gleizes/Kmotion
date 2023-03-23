import React from "react"
import AuthProvider from "./auth"
import LayoutProvider from "./layout"

const ContextsProvider: ComponentWithChild = ({ children }) => {
  return (
    <AuthProvider>
      <LayoutProvider>{children}</LayoutProvider>
    </AuthProvider>
  )
}

export default ContextsProvider
