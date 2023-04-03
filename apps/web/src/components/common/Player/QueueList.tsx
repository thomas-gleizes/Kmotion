import React, { useMemo, useRef } from "react"
import { FaBars } from "react-icons/all"

import { IMusic } from "@kmotion/types"
import { usePlayerContext } from "../../../contexts/player"
import { useIsDisplay } from "../../../hooks"
import ImageLoader from "../ImageLoader"

const QueueList: Component = () => {
  const { actions, queue } = usePlayerContext()

  const nextMusics = useMemo(() => {
    const nextMusics = [...queue]
    nextMusics.splice(0, 1)
    return nextMusics
  }, [queue])

  return (
    <div className="flex flex-col space-y-2 pr-2 pb-8">
      {nextMusics.map((music, index) => (
        <Item key={index} music={music} onGo={() => actions.go(index + 1)} />
      ))}
    </div>
  )
}

interface Props {
  music: IMusic
  onGo: () => void
}

const Item: Component<Props> = ({ music, onGo }) => {
  const [isDisplay, ref] = useIsDisplay<HTMLDivElement>(0.5)

  return (
    <div ref={ref} key={music.id} onClick={onGo} className="flex cursor-pointer group px-1">
      <div className="w-[21%] h-full flex items-center">
        {isDisplay ? (
          <ImageLoader src={music.links.cover}>
            {({ src }) => (
              <img
                src={src}
                alt={`cover ${music.title}`}
                className="rounded-lg w-full group-hover:scale-105 transform transition duration-50"
              />
            )}
          </ImageLoader>
        ) : (
          <img
            className="rounded-lg w-full group-hover:scale-105 transform transition duration-50"
            src="/images/placeholder.png"
            alt={music.title}
          />
        )}
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
}

export default QueueList
