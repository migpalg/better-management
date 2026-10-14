import type { Storage } from './storage.ts'

export class LocalStorage implements Storage {
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
