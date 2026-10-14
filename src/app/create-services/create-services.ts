import { BrowserSession } from '@/features/auth/browser-session/browser-session.ts'
import { HttpAuthService } from '@/features/auth/services/auth-service/http-auth-service/http-auth-service.ts'
import type { AuthService } from '@/features/auth/services/auth-service/auth-service.ts'
import type { HttpClient } from '@/features/common/http/http-client/http-client.ts'
import { FetchHttpClient } from '@/features/common/http/http-client/fetch-http-client/fetch-http-client.ts'
import { LocalStorage } from '@/features/common/key-value-storage/local-storage/local-storage.ts'

export type Services = {
  readonly session: BrowserSession
  readonly auth: AuthService
  readonly http: HttpClient
}

export type CreateServicesOptions = {
  readonly baseUrl?: string
  readonly fetch?: typeof fetch
}

export function createServices(options: CreateServicesOptions = {}): Services {
  const baseUrl = readBaseUrl(options.baseUrl)
  const session = new BrowserSession(new LocalStorage())
  const publicHttp = new FetchHttpClient({ baseUrl, fetch: options.fetch })
  const auth = new HttpAuthService(publicHttp, session)
  const http = new FetchHttpClient({
    baseUrl,
    fetch: options.fetch,
    getAccessToken: () => session.getAccessToken(),
    refresh: (signal) => auth.refresh({ signal }),
  })

  // TODO: Scaffold only. We'll add resource services here and pass them the authenticated client later.
  return { session, auth, http }
}

function readBaseUrl(baseUrl: string | undefined): string {
  if (baseUrl !== undefined && baseUrl.length > 0) return baseUrl

  const configured = import.meta.env.VITE_API_URL ?? ''
  if (configured.length > 0) return configured

  throw new Error('VITE_API_URL is not set.')
}
