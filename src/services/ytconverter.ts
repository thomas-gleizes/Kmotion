const token = process.env.CONVERTER_TOKEN as string

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

  public async musics(): Promise<any> {
    return fetch(this._url + "/musics", { method: "GET", headers: this.getHeaders() }).then(
      (response) => response.json()
    )
  }

  public async info(url: string): Promise<any> {}
}
