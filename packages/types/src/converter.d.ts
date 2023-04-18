export interface ConverterMusic {
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
  thumbnails: any[]
}
