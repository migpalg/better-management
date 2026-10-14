export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type HttpRequest = {
  readonly method: HttpMethod
  readonly path: string
  readonly body?: unknown
  readonly signal?: AbortSignal
}

export interface HttpClient {
  request(request: HttpRequest): Promise<unknown>
}
