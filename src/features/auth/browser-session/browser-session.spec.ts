import { describe, expect, it } from 'vitest'
import { MemoryStorage } from '@/features/common/key-value-storage/memory-storage/memory-storage.ts'
import { BrowserSession } from './browser-session.ts'

const tokens = { accessToken: 'access', refreshToken: 'refresh' }

describe('BrowserSession', () => {
  it('returns null when no tokens are stored', () => {
    const session = new BrowserSession(new MemoryStorage())

    expect(session.getAccessToken()).toBeNull()
    expect(session.getRefreshToken()).toBeNull()
  })

  it('stores and clears both tokens', () => {
    const session = new BrowserSession(new MemoryStorage())

    session.setTokens(tokens)

    expect(session.getAccessToken()).toBe('access')
    expect(session.getRefreshToken()).toBe('refresh')

    session.clear()

    expect(session.getAccessToken()).toBeNull()
    expect(session.getRefreshToken()).toBeNull()
  })
})
