import type { KeyValueStorage } from '@/features/common/key-value-storage/key-value-storage.ts'

export class LocalStorage implements KeyValueStorage {
  get(key: string): string | null {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  }

  set(key: string, value: string) {
    try {
      localStorage.setItem(key, value)
    } catch {
      // Storage can be unavailable (private mode).
    }
  }

  remove(key: string) {
    try {
      localStorage.removeItem(key)
    } catch {
      // Storage can be unavailable (private mode).
    }
  }
}
