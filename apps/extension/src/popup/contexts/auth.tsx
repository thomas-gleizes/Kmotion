import React, { Children, createContext, useState } from "react"

interface Values {
  isAuthentificated: boolean
}

const AuthContext = createContext<Values>(null as never)

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthentificated, setIsAuthentificated] = useState<boolean>(false)

  return <AuthContext.Provider value={{ isAuthentificated }}>{children}</AuthContext.Provider>
}
