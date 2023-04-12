import React, { createContext, useContext, useEffect, useState } from "react"

import { IUser } from "@kmotion/types"
import { STORAGE_KEY } from "../../resources/constants"

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

export const useAuthentificatedContext = () => {
  const context = useAuthContext()

  if (!context.isAuthenticated)
    throw new Error(
      '"useAuthentificatedContext" must be used within a "AuthProvider" with "isAuthenticated" set to true'
    )

  return context
}

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  const [isReady, setIsReady] = useState<boolean>(false)

  useEffect(() => {
    chrome.storage.local.get(STORAGE_KEY.AUTH_TOKEN, (result) => {
      if (result !== null) {
        setIsAuthenticated(true)
      }

      setIsReady(true)
    })
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
    <AuthContext.Provider value={{ isReady, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
