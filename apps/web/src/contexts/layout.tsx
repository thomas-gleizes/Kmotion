import { createContext } from "react"

import { LayoutContextValues } from "../../types/contexts"
import { useContextFactory } from "../hooks"

const LayoutContext = createContext<LayoutContextValues>(null as never)

export const useLayoutContext = useContextFactory(LayoutContext)

const LayoutProvider: ComponentWithChild = ({ children }) => {
  const isLaggedBlur =
    (window.navigator.userAgent.includes("Win32") || window.navigator.userAgent.includes("Win64"))

  return <LayoutContext.Provider value={{ isLaggedBlur }}>{children}</LayoutContext.Provider>
}

export default LayoutProvider
