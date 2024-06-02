import { Track, YoutubeInfo } from "@kmotion/types"

export default class YtConverter {
  private readonly _url: string

  public constructor() {
    this._url = process.env.CONVERTER_URL as string
  }

  public getTracks(): Promise<Track[]> {
    return fetch(`${this._url}/tracks`, { method: "GET" })
      .then((response) => response.json())
      .then((data) => data.tracks)
  }

  public getTrack(id: string): Promise<Track> {
    return fetch(`${this._url}/youtube/${id}`, { method: "GET" })
      .then((response) => response.json())
      .then((data) => data.track)
  }

  public async deleteTrack(id: string): Promise<void> {
    await fetch(`${this._url}/youtube/${id}`, { method: "DELETE" })
  }

  public getYoutubeInfo(youtubeId: string): Promise<{ track: Track; info: YoutubeInfo }> {
    return fetch(`${this._url}/youtube/${youtubeId}/info`, { method: "GET" })
      .then((response) => response.json())
      .then((data) => ({ info: data.info, track: data.track }))
  }

  public download(youtubeId: string): Promise<Track> {
    return fetch(`${this._url}/youtube/${youtubeId}/download`, { method: "POST" })
      .then((response) => response.json())
      .then((data) => data.track)
  }

  public getThumbnail(youtubeId: string): Promise<Response> {
    return fetch(`${this._url}/static/${youtubeId}/thumbnail.webp`, { method: "GET" })
  }

  public getAudio(youtubeId: string): Promise<Response> {
    return fetch(`${this._url}/static/${youtubeId}/audio.mp3`, { method: "GET" })
  }
}
