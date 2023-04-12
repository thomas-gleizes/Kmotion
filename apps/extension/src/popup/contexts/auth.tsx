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
    const [user, token] = await Promise.all([
      new Promise<IUser | null>((resolve) => {
        chrome.storage.local.get([STORAGE_KEY.USER], (result) => {
          resolve(result[STORAGE_KEY.USER])
        })
      }),
      new Promise<string | null>((resolve) => {
        chrome.storage.local.get([STORAGE_KEY.AUTH_TOKEN], (result) => {
          resolve(result[STORAGE_KEY.AUTH_TOKEN])
        })
      }),
    ])

    console.log("Storage", user, token)

    if (user && token) setIsAuthenticated(true)
  }, [])

  const login = async (user: IUser, token: string) => {
    setIsAuthenticated(true)
    chrome.storage.local.set({ [STORAGE_KEY.AUTH_TOKEN]: token })
    chrome.storage.local.set({ [STORAGE_KEY.USER]: user })
  }

  const logout = async () => {
    chrome.storage.local.remove(STORAGE_KEY.AUTH_TOKEN)
    chrome.storage.local.remove(STORAGE_KEY.USER)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isReady: state.loading, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
