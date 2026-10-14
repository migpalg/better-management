import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createServices } from './create-services.ts'

const signal = new AbortController().signal

describe('createServices', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('wires a session and clients without calling fetch', async () => {
    const fetchMock = vi.fn<typeof fetch>()
    const services = createServices({
      baseUrl: 'https://api.example.test',
      fetch: fetchMock,
    })

    services.session.setTokens({
      accessToken: 'access',
      refreshToken: 'refresh',
    })

    expect(services.session.getAccessToken()).toBe('access')
    await expect(
      services.auth.login(
        { email: 'ada@example.test', password: 'secret' },
        { signal },
      ),
    ).rejects.toThrow(
      'TODO: HttpAuthService.login is a scaffold and will be implemented later.',
    )
    await expect(
      services.http.request({ method: 'GET', path: '/tasks', signal }),
    ).rejects.toThrow(
      'TODO: FetchHttpClient.request is a scaffold and will be implemented later.',
    )
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('throws when the base URL is empty', () => {
    vi.stubEnv('VITE_API_URL', '')

    expect(() => createServices()).toThrow('VITE_API_URL is not set.')
  })

  it('throws when the base URL is unset', () => {
    vi.stubEnv('VITE_API_URL', undefined)

    expect(() => createServices()).toThrow('VITE_API_URL is not set.')
  })
})
