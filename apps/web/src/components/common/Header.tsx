import Clock from "./Clock"
import React from "react"

const Header: Component = () => {
  return (
    <div className="absolute z-20 top-0 left-0 w-full h-[36px] py-1 bg-dark bg-opacity-70">
      <div className="flex justify-between">
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
    </div>
  )
}

export default Header