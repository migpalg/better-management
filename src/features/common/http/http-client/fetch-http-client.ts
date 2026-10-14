import type { HttpClient, HttpRequest } from './http-client.ts'

export type FetchHttpClientOptions = {
  readonly baseUrl: string
  readonly fetch?: typeof fetch
  readonly getAccessToken?: () => string | null
  readonly refresh?: (signal: AbortSignal) => Promise<unknown>
}

export class FetchHttpClient implements HttpClient {
  private readonly baseUrl: string
  private readonly fetchFn: typeof fetch
  private readonly getAccessToken: (() => string | null) | undefined
  private readonly refresh:
    | ((signal: AbortSignal) => Promise<unknown>)
    | undefined

  constructor(options: FetchHttpClientOptions) {
    this.baseUrl = options.baseUrl
    this.fetchFn = options.fetch ?? globalThis.fetch
    this.getAccessToken = options.getAccessToken
    this.refresh = options.refresh
  }

  request(request: HttpRequest): Promise<unknown> {
    // TODO: Scaffold only. We'll perform the request, attach the bearer token, refresh once on 401, and map failures to AppError later.
    return Promise.reject(
      new Error(
        'TODO: FetchHttpClient.request is a scaffold and will be implemented later.',
        {
          cause: {
            baseUrl: this.baseUrl,
            fetch: this.fetchFn,
            getAccessToken: this.getAccessToken,
            refresh: this.refresh,
            request,
          },
        },
      ),
    )
  }
}
