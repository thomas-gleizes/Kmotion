import React, { createContext, useContext, useEffect, useState } from "react"

import { IUser } from "@kmotion/types"
import { STORAGE_KEY } from "../../resources/constants"

interface Values {
  isReady: boolean
  isAuthenticated: boolean
  login: (user: IUser, cookie: string) => Promise<void>
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
    chrome.storage.local.get(STORAGE_KEY.SESSION, (result) => {
      if (result !== null) {
        setIsAuthenticated(true)
      }

      setIsReady(true)
    })
  }, [])

  const login = async (user: IUser, cookie: string) => {
    await chrome.storage.local.set({ [STORAGE_KEY.SESSION]: { user, cookie } })
  }

  return (
    <AuthContext.Provider value={{ isReady, isAuthenticated, login }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
