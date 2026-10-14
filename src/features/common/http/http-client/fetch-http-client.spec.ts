import { describe, expect, it, vi } from 'vitest'
import { FetchHttpClient } from './fetch-http-client.ts'

describe('FetchHttpClient', () => {
  it('rejects without calling fetch', async () => {
    const fetchMock = vi.fn<typeof fetch>()
    const client = new FetchHttpClient({
      baseUrl: 'https://api.example.test',
      fetch: fetchMock,
    })

    await expect(
      client.request({
        method: 'GET',
        path: '/tasks',
        signal: new AbortController().signal,
      }),
    ).rejects.toThrow(
      'TODO: FetchHttpClient.request is a scaffold and will be implemented later.',
    )
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
