import { FaForward, FaPause, FaPlay } from "react-icons/all"
import { useState } from "react"

const music = {
  id: 11,
  title: "AViVA - GRRRLS",
  artist: "MrSuicideSheep",
  youtubeId: "Shk7qcvqDOo",
  downloaderId: 1,
  createdAt: "2023-03-05T14:33:05.470Z",
  updatedAt: "2023-03-05T14:33:05.470Z",
}

const DynamicPlayer: Component = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(Math.random() > 0.5)

  return (
    <div className="h-[50px] flex items-center justify-between py-2 px-4 backdrop-blur bg-black bg-opacity-90 border-b border-gray-800">
      <div className="h-full flex items-center space-x-4">
        <div className="h-full">
          <img className="h-full rounded-md shadow-xl" src={`/api/v1/musics/${music.id}/cover`} />
        </div>
        <div>
          <div className="text-sm text-white font-bold text-ellipsis">{music.title}</div>
        </div>
      </div>
      <div className="flex justify-end space-x-10">
        <div>
          <i
            className="text-2xl text-white cursor-pointer"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </i>
        </div>
        <div>
          <i className="text-2xl text-white cursor-pointer">
            <FaForward />
          </i>
        </div>
      </div>
    </div>
  )
}

export default DynamicPlayer
