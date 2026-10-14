import { describe, expect, it, vi } from 'vitest'
import { BrowserSession } from '@/features/auth/browser-session/browser-session.ts'
import type { HttpClient } from '@/features/common/http/http-client/http-client.ts'
import { MemoryStorage } from '@/features/common/key-value-storage/memory-storage/memory-storage.ts'
import { HttpAuthService } from './http-auth-service.ts'

const options = { signal: new AbortController().signal }
const tokens = { accessToken: 'access', refreshToken: 'refresh' }

function createHttp(): HttpClient {
  return { request: vi.fn() }
}

describe('HttpAuthService', () => {
  it('rejects login without calling the client or changing the session', async () => {
    const http = createHttp()
    const session = new BrowserSession(new MemoryStorage())
    session.setTokens(tokens)
    const auth = new HttpAuthService(http, session)

    await expect(
      auth.login({ email: 'ada@example.test', password: 'secret' }, options),
    ).rejects.toThrow(
      'TODO: HttpAuthService.login is a scaffold and will be implemented later.',
    )
    expect(http.request).not.toHaveBeenCalled()
    expect(session.getAccessToken()).toBe('access')
    expect(session.getRefreshToken()).toBe('refresh')
  })

  it('rejects refresh without calling the client or changing the session', async () => {
    const http = createHttp()
    const session = new BrowserSession(new MemoryStorage())
    session.setTokens(tokens)
    const auth = new HttpAuthService(http, session)

    await expect(auth.refresh(options)).rejects.toThrow(
      'TODO: HttpAuthService.refresh is a scaffold and will be implemented later.',
    )
    expect(http.request).not.toHaveBeenCalled()
    expect(session.getAccessToken()).toBe('access')
    expect(session.getRefreshToken()).toBe('refresh')
  })
})
