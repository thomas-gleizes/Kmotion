import React from "react"
import { FiMusic, FiAlertCircle } from "react-icons/fi"

interface NoVideoProps {
  isYoutube: boolean
}

export const NoVideo: React.FC<NoVideoProps> = ({ isYoutube }) => {
  return (
    <div className="w-full p-6 bg-white text-center">
      <div className="flex justify-center mb-4">
        <FiAlertCircle className="text-5xl text-gray-400" />
      </div>

      <h2 className="text-lg font-semibold mb-2">
        {isYoutube ? "No Video Found" : "Not on YouTube"}
      </h2>

      <p className="text-gray-600 text-sm">
        {isYoutube
          ? "Please open a YouTube video to convert it to MP3."
          : "This extension works on YouTube videos. Visit YouTube to get started."}
      </p>

      {!isYoutube && (
        <div className="mt-4">
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <FiMusic size={16} />
            Go to YouTube
          </a>
        </div>
      )}
    </div>
  )
}

