export interface ConvertedMusic {
  id: string
  title: string
  author: string
  album: string
  url: string
  duration: number
  links: {
    mp3: string
    jpg: string
  }
  timestamp: string
}

export type Thumbnail = {
  url: string
  width: number
  height: number
}

export type ConverterMusicInfo = {
  videoId: string
  title: string
  lengthSeconds: string
  media?: {
    artist: string
    album: string
    song: string
  }
  author: {
    name: string
  }
  thumbnails: Thumbnail[]
}
