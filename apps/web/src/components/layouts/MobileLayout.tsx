import React from "react"

import Header from "../common/Header"

const MobileLayout: ComponentWithChild = ({ children }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="relative w-screen h-screen bg-black overflow-hidden">
        <Header />
        <div className="block h-full w-full">{children}</div>
      </div>
    </div>
  )
}

export default MobileLayout
