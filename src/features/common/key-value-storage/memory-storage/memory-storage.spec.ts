import { describe, expect, it } from 'vitest'
import { MemoryStorage } from './memory-storage.ts'

describe('MemoryStorage', () => {
  it('stores, reads, and removes a value', () => {
    const storage = new MemoryStorage()

    expect(storage.get('theme')).toBeNull()

    storage.set('theme', 'dark')

    expect(storage.get('theme')).toBe('dark')

    storage.remove('theme')

    expect(storage.get('theme')).toBeNull()
  })

  it('keeps values separate between instances', () => {
    const first = new MemoryStorage()
    const second = new MemoryStorage()

    first.set('theme', 'dark')

    expect(second.get('theme')).toBeNull()
  })
})
