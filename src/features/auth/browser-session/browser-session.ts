import type { KeyValueStorage } from '@/features/common/key-value-storage/key-value-storage.ts'

const ACCESS_TOKEN_KEY = 'access-token'
const REFRESH_TOKEN_KEY = 'refresh-token'

export type SessionTokens = {
  readonly accessToken: string
  readonly refreshToken: string
}

export class BrowserSession {
  private readonly storage: KeyValueStorage

  constructor(storage: KeyValueStorage) {
    this.storage = storage
  }

  getAccessToken(): string | null {
    return this.storage.get(ACCESS_TOKEN_KEY)
  }

  getRefreshToken(): string | null {
    return this.storage.get(REFRESH_TOKEN_KEY)
  }

  setTokens(tokens: SessionTokens) {
    this.storage.set(ACCESS_TOKEN_KEY, tokens.accessToken)
    this.storage.set(REFRESH_TOKEN_KEY, tokens.refreshToken)
  }

  clear() {
    this.storage.remove(ACCESS_TOKEN_KEY)
    this.storage.remove(REFRESH_TOKEN_KEY)
  }
}
