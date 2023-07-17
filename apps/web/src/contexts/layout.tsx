import { createContext, useState } from "react"

import { LayoutContextValues } from "../../types/contexts"
import { useContextFactory } from "../hooks"
import { isMobileOrTablet } from "../utils/helpers"

const LayoutContext = createContext<LayoutContextValues>(null as never)

export const useLayoutContext = useContextFactory(LayoutContext)

const LayoutProvider: ComponentWithChild = ({ children }) => {
  const [isMobile] = useState(isMobileOrTablet)
  const [isLaggedBlur] = useState(
    window.navigator.userAgent.includes("Win32") || window.navigator.userAgent.includes("Win64"),
  )

  return (
    <LayoutContext.Provider value={{ isMobile, isLaggedBlur }}>{children}</LayoutContext.Provider>
  )
}

export default LayoutProvider
