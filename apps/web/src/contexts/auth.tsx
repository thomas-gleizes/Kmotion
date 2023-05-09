import React, { createContext, useContext, useEffect } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import useLocalStorageState from "use-local-storage-state"

import { IUser } from "@kmotion/types"
import { AuthContextValues, AuthenticatedValues, UnauthenticatedValues } from "../../types/contexts"
import { LOCAL_STORAGE_KEYS, WINDOW_MESSAGE } from "../utils/constants"
import { api } from "../utils/Api"
import GeneraLoading from "../components/layouts/GeneraLoading"

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
  const [authenticated, setAuthenticated] = useLocalStorageState<boolean>(LOCAL_STORAGE_KEYS.AUTH, {
    defaultValue: false,
  })

  const queryClient = useQueryClient()

  const queryAuth = useQuery({
    queryKey: ["auth-user"],
    queryFn: () => api.profile(),
    enabled: authenticated,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token)
    },
  })

  const login = async (user: IUser, token: string) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, token)
    setAuthenticated(true)
    queryClient.setQueryData(["auth-user"], { user, token })
  }

  const logout = () => {
    setAuthenticated(false)
    queryClient.setQueryData(["auth-user"], null)
    localStorage.clear()
  }

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (event.data.type === WINDOW_MESSAGE.logout) logout()
    }

    window.addEventListener("message", listener)

    return () => window.removeEventListener("message", listener)
  }, [])

  if (queryAuth.isFetching) return <GeneraLoading />

  const values: AuthContextValues = (() => {
    if (authenticated && queryAuth.data) {
      return {
        authenticated: true,
        user: queryAuth.data.user as IUser,
        logout,
      }
    } else {
      return {
        authenticated: false,
        login,
      }
    }
  })()

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export default AuthProvider
