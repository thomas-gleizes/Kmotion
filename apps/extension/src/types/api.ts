export interface LoginResponse {
  access_token: string
}

export interface MusicResponse {
  id: string
  youtubeId: string
  title: string
  thumbnail?: string
  status: string
}
