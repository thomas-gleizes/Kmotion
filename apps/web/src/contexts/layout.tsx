import { createContext } from "react"

import { LayoutContextValues } from "../../types/contexts"
import { useContextFactory } from "../hooks"

const LayoutContext = createContext<LayoutContextValues>(null as never)

export const useLayoutContext = useContextFactory(LayoutContext)

const LayoutProvider: ComponentWithChild = ({ children }) => {
  return <LayoutContext.Provider value={{}}>{children}</LayoutContext.Provider>
}

export default LayoutProvider
