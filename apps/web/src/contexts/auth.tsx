import { createContext, useContext, useEffect, useMemo } from "react"
import useLocalStorageState from "use-local-storage-state"

import { IUser } from "@kmotion/types"
import { AuthContextValues, AuthenticatedValues, UnauthenticatedValues } from "../../types/contexts"
import { LOCAL_STORAGE_KEYS, WINDOW_MESSAGE } from "../utils/constants"

const AuthContext = createContext<AuthContextValues>({ authenticated: false } as AuthContextValues)

export const useAuthContext = () => {
  const context = useContext(AuthContext)

  if (!context) throw new Error("useAuthContext must be used within AuthProvider")

  if (context.authenticated) return context as AuthenticatedValues
  else return context as UnauthenticatedValues
}

export const useAuthenticatedContext = () => {
  const context = useContext(AuthContext)

  if (!context) throw new Error("useAuthContext must be used within AuthProvider")
  if (!context.authenticated)
    throw new Error("useAuthenticatedContext muse be used when user is login")

  return context as AuthenticatedValues
}

export const useUnAuthenticatedContext = () => {
  const context = useContext(AuthContext)

  if (!context) throw new Error("useAuthContext must be used within AuthProvider")
  if (context.authenticated)
    throw new Error("useAuthenticatedContext muse be used when user is login")

  return context as UnauthenticatedValues
}

const AuthProvider: ComponentWithChild = ({ children }) => {
  const [authenticated, setAuthenticated] = useLocalStorageState<boolean>("authenticated", {
    defaultValue: false,
  })
  const [user, setUser] = useLocalStorageState<IUser | null>("user", { defaultValue: null })

  const login = (user: IUser, token: string) => {
    setUser(user)
    setAuthenticated(true)

    localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, token)
  }

  const logout = () => {
    setUser(null)
    setAuthenticated(false)
    localStorage.clear()
  }

  useEffect(() => {
    window.addEventListener("message", (event) => {
      if (event.data.type === WINDOW_MESSAGE.logout) logout()
    })
  }, [])

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
