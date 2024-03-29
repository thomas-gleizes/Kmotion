import { ConvertedMusic, ConverterMusicDetails } from "@kmotion/types"

export default class YtConverter {
  private static instance: YtConverter

  private _url: string
  private _token: string

  private constructor() {
    this._url = process.env.CONVERTER_URL as string
    this._token = process.env.CONVERTER_TOKEN as string
  }

  public static getInstance(): YtConverter {
    if (!YtConverter.instance) {
      YtConverter.instance = new YtConverter()
    }

    return YtConverter.instance
  }

  private getHeaders(): Headers {
    const headers = new Headers()
    headers.append("authorization", this._token)

    return headers
  }

  public async musics(): Promise<Array<ConvertedMusic>> {
    return fetch(`${this._url}/musics`, { method: "GET", headers: this.getHeaders() })
      .then((response) => response.json())
      .then((data) => data.musics)
  }

  public info(
    youtubeId: string,
  ): Promise<{ details: ConverterMusicDetails; music: ConvertedMusic }> {
    return fetch(`${this._url}/${youtubeId}/info`, {
      method: "GET",
      headers: this.getHeaders(),
    }).then((response) => response.json())
  }

  public download(youtubeId: string): Promise<{ music: ConvertedMusic; alreadyDownload: boolean }> {
    return fetch(`${this._url}/${youtubeId}/download`, {
      method: "GET",
      headers: this.getHeaders(),
    }).then((response) => response.json())
  }

  public stream(youtubeId: string): Promise<Buffer> {
    return fetch(`${this._url}/static/${youtubeId}/${youtubeId}.mp3`, {
      method: "GET",
      headers: this.getHeaders(),
    })
      .then((response) => response.arrayBuffer())
      .then((buffer) => Buffer.from(buffer))
  }

  public cover(youtubeId: string): Promise<Buffer> {
    return fetch(`${this._url}/static/${youtubeId}/${youtubeId}.webp`, {
      method: "GET",
      headers: this.getHeaders(),
    })
      .then((response) => response.arrayBuffer())
      .then((buffer) => Buffer.from(buffer))
  }

  public delete(youtubeId: string): Promise<unknown> {
    return fetch(`${this._url}/${youtubeId}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    })
  }
}
