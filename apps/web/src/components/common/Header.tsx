import React from "react"
import Clock from "./Clock"

const Header: Component = () => {
  return null

  return (
    <div className="absolute z-[1000] top-0 left-0 w-full h-header bg-secondary/50 backdrop-blur-lg">
      <div className="flex justify-center items-center h-full">
        <Clock />
      </div>
    </div>
  )
}

export default Header
