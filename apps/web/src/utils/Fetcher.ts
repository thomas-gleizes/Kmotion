export class Fetcher {
  private readonly version: string
  private readonly requestInteceptor: Array<() => void>
  private readonly responseInterceptor: Array<() => void>

  private readonly DEFAULT_HEADERS = {
    "Content-Type": "application/json",
  }

  constructor(version: string) {
    this.version = version
    this.requestInteceptor = []
    this.responseInterceptor = []
  }

  public async interceptRequest(interceptorCallback: () => void) {
    this.requestInteceptor.push(interceptorCallback)
  }

  public async interceptResponse(interceptorCallback: () => void) {
    this.responseInterceptor.push(interceptorCallback)
  }

  private async fetch(path: string, init?: RequestInit) {
    const response = await fetch(`/api/${this.version}/${path}`, {
      ...init,
      headers: { ...this.DEFAULT_HEADERS, ...init?.headers },
    })

    if (!response.ok) throw response

    return response
  }

  public get(path: string, init?: Omit<RequestInit, "method">) {
    return this.fetch(path, { method: "GET", ...init })
  }

  public post(path: string, init?: Omit<RequestInit, "method">) {
    return this.fetch(path, { method: "POST", ...init })
  }

  public patch(path: string, init?: Omit<RequestInit, "method">) {
    return this.fetch(path, { method: "PATCH", ...init })
  }

  public delete(path: string, init?: Omit<RequestInit, "method">) {
    return this.fetch(path, { method: "DELETE", ...init })
  }

  public put(path: string, init?: Omit<RequestInit, "method">) {
    return this.fetch(path, { method: "PUT", ...init })
  }

  public parseQueryString(obj: any): string {
    return `?${new URLSearchParams(obj).toString()}`
  }
}
