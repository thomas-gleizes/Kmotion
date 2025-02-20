import { Track, YoutubeInfo } from "@kmotion/types"

export default class YtConverter {
  private readonly _url: string
  private readonly _apiKey: string

  public constructor() {
    this._url = process.env.CONVERTER_URL as string
    this._apiKey = process.env.CONVERTER_TOKEN as string
  }

  private getHeaders(): Headers {
    return new Headers({
      "Content-Type": "application/json",
      API_KEY: this._apiKey,
    })
  }

  public getTracks(): Promise<Track[]> {
    return fetch(`${this._url}/tracks`, { method: "GET", headers: this.getHeaders() })
      .then((response) => response.json())
      .then((data) => data.tracks)
  }

  public getTrack(id: string): Promise<Track> {
    return fetch(`${this._url}/youtube/${id}`, { method: "GET", headers: this.getHeaders() })
      .then((response) => response.json())
      .then((data) => data.track)
  }

  public async deleteTrack(id: string): Promise<void> {
    await fetch(`${this._url}/youtube/${id}`, { method: "DELETE", headers: this.getHeaders() })
  }

  public getYoutubeInfo(youtubeId: string): Promise<{ track: Track; info: YoutubeInfo }> {
    return fetch(`${this._url}/youtube/${youtubeId}/info`, {
      method: "GET",
      headers: this.getHeaders(),
    })
      .then((response) => response.json())
      .then((data) => ({ info: data.info, track: data.track }))
  }

  public download(youtubeId: string): Promise<Track> {
    console.log("YoutubeId", youtubeId)

    return fetch(`${this._url}/youtube/${youtubeId}/download`, {
      method: "POST",
      headers: this.getHeaders(),
    })
      .then((response) => response.json())
      .then((data) => data.track)
  }

  public getThumbnail(youtubeId: string): Promise<Response> {
    return fetch(`${this._url}/static/${youtubeId}/thumbnail.webp`, {
      method: "GET",
      headers: this.getHeaders(),
    })
  }

  public getAudio(youtubeId: string): Promise<Response> {
    return fetch(`${this._url}/static/${youtubeId}/audio.mp3`, {
      method: "GET",
      headers: this.getHeaders(),
    })
  }
}
