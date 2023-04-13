import React from "react"

const VideoScreen = () => {
  return (
    <div>
      <h1 className="text-white">VIDEO</h1>

      <div className="space-y-1 divide-black">
        {Array.from({ length: 30 }).map((_, i) => (
          <div>
            <h1 className="">VIDEO {i}</h1>
          </div>
        ))}
      </div>
    </div>
  )
}
export default VideoScreen
