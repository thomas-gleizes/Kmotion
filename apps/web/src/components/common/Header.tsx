import React from "react"

import { useLayoutContext } from "../../contexts/layout"
import Clock from "./Clock"

const Header: Component = () => {
  const { mobile } = useLayoutContext()

  return (
    <div className="absolute z-[1000] top-0 left-0 w-full h-header bg-secondary/50 backdrop-blur-lg">
      {!mobile.value ? (
        <div className="flex justify-between items-center h-full">
          <div className="w-1/3 px-4">
            <div className="text-right text-white text-sm text-gray-500 font-bold">
              {new Date().toLocaleDateString()}
            </div>
          </div>
          <div className="w-1/3" />
          <div className="w-1/3 px-4">
            <Clock />
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-full">
          <Clock />
        </div>
      )}
    </div>
  )
}

export default Header
