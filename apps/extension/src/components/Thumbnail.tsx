import React, { useEffect, useState } from "react"
import { FiMusic } from "react-icons/fi"
import { api } from "../utils/api"

interface ThumbnailProps {
  musicId: string
  className?: string
}

/** Renders an auth-protected thumbnail. Blob URLs are cached/shared by `api`. */
export const Thumbnail: React.FC<ThumbnailProps> = ({ musicId, className = "" }) => {
  const [url, setUrl] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let active = true
    setUrl(null)
    setFailed(false)

    api
      .fetchThumbnailBlobUrl(musicId)
      .then((blobUrl) => active && setUrl(blobUrl))
      .catch(() => active && setFailed(true))

    return () => {
      active = false
    }
  }, [musicId])

  if (url) {
    return <img src={url} alt="" className={`object-cover ${className}`} />
  }

  return (
    <div className={`flex items-center justify-center bg-surface-raised ${className}`}>
      {failed && <FiMusic className="text-ink-tertiary" />}
    </div>
  )
}
