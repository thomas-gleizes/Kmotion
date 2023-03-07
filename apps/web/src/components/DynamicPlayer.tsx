import React, { MouseEvent } from "react"
import { FaBackward, FaForward, FaPause, FaPlay } from "react-icons/all"
import { useToggle } from "react-use"

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
  const [isPlaying, togglePlaying] = useToggle(Math.random() > 0.5)
  const [isFullscreen, toggleFullscreen] = useToggle(false)

  const handleFullPlayer = (event: MouseEvent) => {
    event.stopPropagation()
    toggleFullscreen()
  }

  return (
    <div
      onClick={handleFullPlayer}
      className="h-[50px] flex items-center justify-between py-2 px-3 backdrop-blur bg-black bg-opacity-80 border-b border-neutral-800"
    >
      <div className="h-full flex items-center space-x-4 w-[65%]">
        <div className="h-full">
          <img
            className="h-full w-full rounded-md shadow-xl"
            src={`/api/v1/musics/${music.id}/cover`}
            alt={"cover of " + music.title}
          />
        </div>
        <div>
          <div className="text-sm text-white font-bold">{music.title}</div>
        </div>
      </div>
      <div className="flex justify-between items-center w-[35%]">
        <div>
          <i className="text-2xl text-white cursor-pointer">
            <FaBackward />
          </i>
        </div>
        <div>
          <i className="text-2xl text-white cursor-pointer" onClick={togglePlaying}>
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
