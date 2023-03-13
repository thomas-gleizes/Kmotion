import React from "react"
import classnames from "classnames"

interface Props {
  ids: Array<number>
  className?: string
}

const PlaylistGridImage: Component<Props> = ({ ids, className }) => {
  const backgroundImgUrl = (id: number | undefined) => {
    if (id) return `/api/v1/musics/${id}/cover`
    return ""
  }

  return (
    <div
      className={classnames(
        "grid grid-cols-2 h-full bg-neutral-800 rounded-xl grid-rows-2",
        className
      )}
    >
      <div
        className="h-[1/2] w-[1/2] bg-cover bg-center rounded-tl-xl"
        style={{
          backgroundImage: `url(${backgroundImgUrl(ids[0])})`,
        }}
      />
      <div
        className="h-h-[1/2] w-[1/2] bg-cover bg-center rounded-tr-xl"
        style={{
          backgroundImage: `url(${backgroundImgUrl(ids[1])})`,
        }}
      />
      <div
        className="h-[1/2] w-[1/2] bg-cover bg-center rounded-bl-xl"
        style={{
          backgroundImage: `url(${backgroundImgUrl(ids[2])})`,
        }}
      />
      <div
        className="h-[1/2] w-[1/2] bg-cover bg-center rounded-br-xl"
        style={{
          backgroundImage: `url(${backgroundImgUrl(ids[3])})`,
        }}
      />
    </div>
  )
}

export default PlaylistGridImage
