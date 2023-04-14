export class Fetcher {
  private readonly version: string
  private readonly requestInterceptor: RequestInterceptor[]
  private readonly responseInterceptor: ResponseInterceptor[]

  private readonly DEFAULT_HEADERS = {
    Accept: "application/json",
  }

  constructor(version: string) {
    this.version = version
    this.requestInterceptor = []
    this.responseInterceptor = []
  }

  public interceptRequest(interceptorCallback: RequestInterceptor) {
    this.requestInterceptor.push(interceptorCallback)
  }

  public interceptResponse(interceptorCallback: ResponseInterceptor) {
    this.responseInterceptor.push(interceptorCallback)
  }

  private async fetch(path: string, init?: RequestInit): Promise<Response> {
    for (const interceptor of this.requestInterceptor) {
      const { path: newPath, init: newInit } = interceptor({ path, init })
      path = newPath
      init = newInit
    }

    const headers: Headers = new Headers({ ...this.DEFAULT_HEADERS, ...init?.headers })
    if (init?.body) {
      headers.set("content-type", "application/json")
    }

    const response = await fetch(`/api/${this.version}/${path}`, {
      ...init,
      headers,
    })

    for (const interceptor of this.responseInterceptor) interceptor(response, { path, init })

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
