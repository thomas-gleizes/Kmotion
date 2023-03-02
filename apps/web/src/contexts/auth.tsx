import { createContext } from "react"
import { AuthContextValues } from "../../types/contexts"

const AuthContext = createContext<AuthContextValues>({ authenticated: false } as AuthContextValues)

const AuthProvider: ComponentWithChild = ({ children }) => {
  return (
    <AuthContext.Provider
      value={{
        authenticated: false,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
