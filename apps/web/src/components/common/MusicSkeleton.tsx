import React, { useState } from "react"
import { randomMinMax } from "../../utils/number"

const MusicSkeleton: Component = () => {
  const [titleLength] = useState(randomMinMax(40, 98))
  const [descLength] = useState(randomMinMax(20, titleLength))

  return (
    <div className="flex space-x-3 w-full">
      <div className="bg-gray-200 rounded-lg animate-pulse h-10 w-1/5">
        <img src="/images/placeholder.png" alt="placeholder" className="w-full opacity-0" />
      </div>
      <div className="w-4/5 border-b border-white/50">
        <div
          style={{ width: `${titleLength}%` }}
          className="bg-gray-200/50 rounded-lg animate-pulse h-2 mt-2"
        />
        <div
          style={{ width: `${descLength}%` }}
          className="bg-gray-200/20 rounded-lg animate-pulse  h-2 mt-2"
        />
      </div>
    </div>
  )
}

export default MusicSkeleton
