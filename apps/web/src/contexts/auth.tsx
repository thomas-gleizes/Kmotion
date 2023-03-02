import { createContext, useContext, useMemo } from "react"
import useLocalStorageState from "use-local-storage-state"

import { AuthContextValues, IsAuth } from "../../types/contexts"
import { IUser } from "@kmotion/types"

const AuthContext = createContext<AuthContextValues>({ authenticated: false } as AuthContextValues)

export const useAuthContext = (isAuth: keyof IsAuth) => {
  const context = useContext(AuthContext)

  if (!context) throw new Error("useAuthContext must be used within AuthProvider")

  return context as IsAuth[keyof IsAuth]
}

const AuthProvider: ComponentWithChild = ({ children }) => {
  const [authenticated, setAuthenticated] = useLocalStorageState<boolean>("authenticated", {
    defaultValue: false,
  })
  const [user, setUser] = useLocalStorageState<IUser | null>("user", { defaultValue: null })

  const login = (user: IUser) => {
    setUser(user)
    setAuthenticated(true)
  }

  const logout = () => {
    setUser(null)
    setAuthenticated(false)
  }

  const value = useMemo<AuthContextValues>(() => {
    if (authenticated) {
      return {
        authenticated: true,
        user: user as IUser,
        logout,
      }
    } else {
      return {
        authenticated: false,
        login,
      }
    }
  }, [authenticated, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
