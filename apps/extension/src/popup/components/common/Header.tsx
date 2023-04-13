import React from "react"

const Header: React.FC = () => {
  return (
    <div className="z-40 flex items-center w-full h-header bg-neutral-200 rounded-b-lg shadow-lg">
      <div className="h-full w-full flex items-baseline justify-evenly px-2 py-1">
        <h1 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
          K'motion
        </h1>
        <p className="text-black/70">v0.0.1-dev</p>
      </div>
    </div>
  )
}

export default Header
