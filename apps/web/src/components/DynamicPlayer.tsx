import React, { MouseEvent } from "react"
import { FaBackward, FaForward, FaPause, FaPlay } from "react-icons/all"
import { useToggle } from "react-use"
import { usePlayerContext } from "../contexts/player"

const DynamicPlayer: Component = () => {
  const { currentMusic, actions } = usePlayerContext()

  const [isPlaying, togglePlaying] = useToggle(Math.random() > 0.5)
  const [isFullscreen, toggleFullscreen] = useToggle(false)

  const handleFullPlayer = (event: MouseEvent) => {
    event.stopPropagation()
    toggleFullscreen()
  }

  if (!currentMusic) return null

  return (
    <div
      onClick={handleFullPlayer}
      className="h-[50px] flex items-center justify-between py-2 px-3 backdrop-blur bg-black bg-opacity-80 border-b border-neutral-800"
    >
      <div className="h-full flex items-center space-x-4 w-[65%]">
        <div className="h-full">
          <img
            className="h-full w-full rounded-md shadow-xl"
            src={`/api/v1/musics/${currentMusic.id}/cover`}
            alt={"cover of " + currentMusic.title}
          />
        </div>
        <div>
          <p className="text-sm text-white truncate max-w-[160px]">{currentMusic.title}</p>
        </div>
      </div>
      <div className="flex justify-between items-center w-[35%]">
        <div>
          <i className="text-2xl text-white cursor-pointer">
            <FaBackward onClick={actions.previous} />
          </i>
        </div>
        <div>
          <i className="text-2xl text-white cursor-pointer" onClick={togglePlaying}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </i>
        </div>
        <div>
          <i className="text-2xl text-white cursor-pointer">
            <FaForward onClick={actions.next} />
          </i>
        </div>
      </div>
    </div>
  )
}

export default DynamicPlayer
