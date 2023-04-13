import React, { createContext, useContext, useState } from "react"

import { IUser } from "@kmotion/types"
import { STORAGE_KEY } from "../../resources/constants"
import { useAsync } from "react-use"

interface Values {
  isReady: boolean
  isAuthenticated: boolean
  login: (user: IUser, cookie: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<Values>(null as never)

export const useAuthContext = () => {
  const context = useContext(AuthContext)

  if (!context) throw new Error('"useAuthContext" must be used within a "AuthProvider"')

  return context
}

export const useAuthenticatedContext = () => {
  const context = useAuthContext()

  if (!context.isAuthenticated)
    throw new Error(
      '"useAuthenticatedContext" must be used within a "AuthProvider" with "isAuthenticated" set to true'
    )

  return context
}

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  const state = useAsync(async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const info = await chrome.storage.local.get([STORAGE_KEY.USER, STORAGE_KEY.AUTH_TOKEN])
    if (info[STORAGE_KEY.USER] && info[STORAGE_KEY.AUTH_TOKEN]) {
      setIsAuthenticated(true)
    } else void logout()
  }, [])

  const login = async (user: IUser, token: string) => {
    await chrome.storage.local.set({ [STORAGE_KEY.AUTH_TOKEN]: token, [STORAGE_KEY.USER]: user })
    setIsAuthenticated(true)
  }

  const logout = async () => {
    await chrome.storage.local.remove([STORAGE_KEY.AUTH_TOKEN, STORAGE_KEY.USER])
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isReady: !state.loading, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
