import ImageLoader from "../ImageLoader"
import { FaBars } from "react-icons/all"
import React, { useMemo } from "react"
import { usePlayerContext } from "../../../contexts/player"

const QueueList: Component = () => {
  const { actions, queue } = usePlayerContext()

  const nextMusics = useMemo(() => {
    const nextMusics = [...queue]
    nextMusics.splice(0, 1)
    return nextMusics
  }, [queue])

  return (
    <div className="flex flex-col space-y-2 pr-2 pb-8">
      {nextMusics.slice(0, 50).map((music, index) => {
        return (
          <div
            key={music.id}
            className="flex cursor-pointer group px-1"
            onClick={() => actions.go(index + 1)}
          >
            <div className="w-[21%] h-full flex items-center">
              <ImageLoader src={music.links.cover}>
                {({ src }) => (
                  <img
                    src={src}
                    alt={`cover ${music.title}`}
                    className="rounded-lg w-full group-hover:scale-105 transform transition duration-50"
                  />
                )}
              </ImageLoader>
            </div>
            <div className="w-[79%] flex justify-between items-center">
              <div className="w-full truncate overflow-hidden px-3">
                <h6 className="text-white truncate text-sm lg:text-xl text-opacity-90 group-hover:text-opacity-100 group-hover:font-semibold">
                  {music.title}
                </h6>
                <p className="text-white text-xs lg:text-sm text-opacity-75 group-hover:text-opacity-90">
                  {music.artist}
                </p>
              </div>
              <div className="w-min">
                <span className="text-white/70">
                  <FaBars />
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default QueueList
