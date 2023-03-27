import { createContext, useContext } from "react"

import { LayoutContextValues } from "../../types/contexts"

const LayoutContext = createContext<LayoutContextValues>(null as never)

export const useLayoutContext = () => {
  return useContext(LayoutContext)
}

const LayoutProvider: ComponentWithChild = ({ children }) => {
  return <LayoutContext.Provider value={{}}>{children}</LayoutContext.Provider>
}

export default LayoutProvider
