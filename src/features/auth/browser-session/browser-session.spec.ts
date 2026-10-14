import { describe, expect, it } from 'vitest'
import type { Storage } from '@/features/common/storage/storage.ts'
import { BrowserSession } from './browser-session.ts'

const tokens = { accessToken: 'access', refreshToken: 'refresh' }

function createMemoryStorage(): Storage {
  const values = new Map<string, string>()

  return {
    get: (key) => values.get(key) ?? null,
    set: (key, value) => {
      values.set(key, value)
    },
    remove: (key) => {
      values.delete(key)
    },
  }
}

describe('BrowserSession', () => {
  it('returns null when no tokens are stored', () => {
    const session = new BrowserSession(createMemoryStorage())

    expect(session.getAccessToken()).toBeNull()
    expect(session.getRefreshToken()).toBeNull()
  })

  it('stores and clears both tokens', () => {
    const session = new BrowserSession(createMemoryStorage())

    session.setTokens(tokens)

    expect(session.getAccessToken()).toBe('access')
    expect(session.getRefreshToken()).toBe('refresh')

    session.clear()

    expect(session.getAccessToken()).toBeNull()
    expect(session.getRefreshToken()).toBeNull()
  })
})
