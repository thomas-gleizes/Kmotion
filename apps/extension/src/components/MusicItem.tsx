import React from "react"
import type { Music } from "../utils/api"
import { formatDuration } from "../utils/format"
import { Thumbnail } from "./Thumbnail"

export const MusicItem: React.FC<{ music: Music }> = ({ music }) => {
  return (
    <li className="flex items-center gap-3 px-3 py-2 mx-2 rounded-s hover:bg-white/5 transition">
      <Thumbnail
        musicId={music.id}
        className="w-11 h-11 rounded-md flex-shrink-0"
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ink truncate">{music.title}</p>
        <p className="text-xs text-ink-secondary truncate">{music.artist}</p>
      </div>
      <span className="text-xs text-ink-tertiary flex-shrink-0 tabular-nums">
        {formatDuration(music.duration)}
      </span>
    </li>
  )
}
