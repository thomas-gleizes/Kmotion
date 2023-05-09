import React from "react"
import classnames from "classnames"
import ImageLoader from "./ImageLoader"

interface Props {
  ids: Array<number>
  className?: string
}

const PlaylistGridImage: Component<Props> = ({ ids, className }) => {
  const backgroundImgUrl = (id: number | undefined) => {
    if (id) return `/api/v1/musics/${id}/cover`
    return undefined
  }

  return (
    <div
      className={classnames(
        "grid grid-cols-2 h-full bg-neutral-800 rounded-xl grid-rows-2",
        className
      )}
    >
      <ImageLoader id={ids[0]}>
        {({ src }) => (
          <div
            className="h-[1/2] w-[1/2] bg-cover bg-center rounded-tl-xl"
            style={{ backgroundImage: `url(${src})` }}
          />
        )}
      </ImageLoader>
      <ImageLoader id={ids[1]}>
        {({ src }) => (
          <div
            className="h-[1/2] w-[1/2] bg-cover bg-center rounded-tr-xl"
            style={{ backgroundImage: `url(${src})` }}
          />
        )}
      </ImageLoader>
      <ImageLoader id={ids[2]}>
        {({ src }) => (
          <div
            className="h-[1/2] w-[1/2] bg-cover bg-center rounded-bl-xl"
            style={{ backgroundImage: `url(${src})` }}
          />
        )}
      </ImageLoader>
      <ImageLoader id={ids[3]}>
        {({ src }) => (
          <div
            className="h-[1/2] w-[1/2] bg-cover bg-center rounded-br-xl"
            style={{ backgroundImage: `url(${src})` }}
          />
        )}
      </ImageLoader>
    </div>
  )
}

export default PlaylistGridImage
