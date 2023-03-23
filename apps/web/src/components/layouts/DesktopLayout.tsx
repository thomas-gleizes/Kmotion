import Header from "../common/Header"
import React from "react"

const DesktopLayout: ComponentWithChild = ({ children }) => {
  return (
    <div className="flex justify-center items-center w-screen h-screen bg-gray-900 shadow-2xl">
      <div className="mockup-phone">
        <div className="camera" />
        <div className="display relative">
          <div className="artboard artboard-demo phone-3 block bg-black">
            <Header />
            <div className="block h-full w-full">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DesktopLayout
