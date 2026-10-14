import type { BrowserSession } from '@/features/auth/browser-session/browser-session.ts'
import type { HttpClient } from '@/features/common/http/http-client/http-client.ts'
import type { ServiceOptions } from '@/features/common/service-options.ts'
import type {
  AuthService,
  LoginInput,
} from '@/features/auth/services/auth-service/auth-service.ts'

export class HttpAuthService implements AuthService {
  private readonly http: HttpClient
  private readonly session: BrowserSession

  constructor(http: HttpClient, session: BrowserSession) {
    this.http = http
    this.session = session
  }

  login(input: LoginInput, options?: ServiceOptions): Promise<void> {
    // TODO: Scaffold only. We'll sign in through the anonymous client and store the tokens later.
    return Promise.reject(
      new Error(
        'TODO: HttpAuthService.login is a scaffold and will be implemented later.',
        { cause: { http: this.http, session: this.session, input, options } },
      ),
    )
  }

  refresh(options?: ServiceOptions): Promise<void> {
    // TODO: Scaffold only. We'll refresh the session through the anonymous client later. The refresh request uses its own AbortController.
    return Promise.reject(
      new Error(
        'TODO: HttpAuthService.refresh is a scaffold and will be implemented later.',
        { cause: { http: this.http, session: this.session, options } },
      ),
    )
  }
}
