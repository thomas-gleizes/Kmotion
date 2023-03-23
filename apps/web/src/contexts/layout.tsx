import { createContext, useContext } from "react"
import { isMobile } from "react-device-detect"
import useLocalStorageState from "use-local-storage-state"

import { LayoutContextValues } from "../../types/contexts"

const LayoutContext = createContext<LayoutContextValues>(null as never)

export const useLayoutContext = () => {
  return useContext(LayoutContext)
}

const LayoutProvider: ComponentWithChild = ({ children }) => {
  const [isMobileLayout, setIsMobileLayout] = useLocalStorageState<boolean>("is-mobile", {
    defaultValue: isMobile,
  })

  return (
    <LayoutContext.Provider
      value={{
        mobile: {
          value: isMobileLayout,
          toggle: (value?: boolean) => setIsMobileLayout(value ?? !isMobileLayout),
        },
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

export default LayoutProvider
