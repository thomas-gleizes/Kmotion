export type Track = {
  id: string
  youtubeId: string
  title: string
  artist: string
  channel: string
  duration: number
  thumbnail: string
  audio: string
  isReady: boolean
  createdAt: string
}

export type YoutubeInfo = {
  id: string
  title: string
  channel: string
  duration: number
  thumbnail: string
  timestamp: number
  thumbnails: { url: string; preference: number; id: number }[]
  description: string
  view_count: number
  heatmap: { start_time: number; end_time: number; value: number }[]
  resolution: string
  width: number
  height: number
}
