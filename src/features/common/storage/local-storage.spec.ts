import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { LocalStorage } from './local-storage.ts'

describe('LocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('stores, reads, and removes a value', () => {
    const storage = new LocalStorage()

    expect(storage.get('theme')).toBeNull()

    storage.set('theme', 'dark')

    expect(storage.get('theme')).toBe('dark')

    storage.remove('theme')

    expect(storage.get('theme')).toBeNull()
  })

  it('ignores storage failures', () => {
    vi.spyOn(globalThis.Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('denied')
    })
    vi.spyOn(globalThis.Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('denied')
    })
    vi.spyOn(globalThis.Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('denied')
    })
    const storage = new LocalStorage()

    expect(() => storage.set('theme', 'dark')).not.toThrow()
    expect(storage.get('theme')).toBeNull()
    expect(() => storage.remove('theme')).not.toThrow()
  })
})
