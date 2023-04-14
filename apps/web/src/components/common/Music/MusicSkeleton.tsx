import React, { useState } from "react"
import { randomMinMax } from "../../../utils/number"

const MusicSkeleton: Component = () => {
  const [titleLength] = useState(randomMinMax(40, 98))
  const [descLength] = useState(randomMinMax(titleLength / 2, titleLength - 4))

  return (
    <div className="flex space-x-3 w-full">
      <div className="bg-gray-200 rounded-lg animate-pulse h-fit w-1/5">
        <img src="/images/placeholder.png" alt="chargement ..." className="w-full opacity-0" />
      </div>
      <div className="w-4/5 flex flex-col justify-center space-y-0.5 lg:space-y-2  border-b border-white/50">
        <div
          style={{ width: `${titleLength}%` }}
          className="bg-gray-200/70 rounded-sm animate-pulse h-2 lg:h-4 mt-2"
        />
        <div
          style={{ width: `${descLength}%` }}
          className="bg-gray-200/40 rounded-sm animate-pulse h-1.5 lg:h-3 mt-2"
        />
      </div>
    </div>
  )
}

export default MusicSkeleton
