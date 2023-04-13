import React from "react"
import { ScaleLoader } from "react-spinners"

import { useAuthContext } from "../contexts/auth"

const AppRoot: React.FC<LayoutProps> = ({ children }) => {
  const { isReady } = useAuthContext()

  return (
    <div className="relative h-full w-full bg-white">
      {!isReady ? (
        <div className="flex items-center justify-center h-24 w-full">
          <ScaleLoader color="#3b82f6" />
        </div>
      ) : (
        children
      )}
    </div>
  )
}

export default AppRoot
