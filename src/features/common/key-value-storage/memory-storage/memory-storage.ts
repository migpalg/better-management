import type { KeyValueStorage } from '@/features/common/key-value-storage/key-value-storage.ts'

export class MemoryStorage implements KeyValueStorage {
  private readonly values = new Map<string, string>()

  get(key: string): string | null {
    return this.values.get(key) ?? null
  }

  set(key: string, value: string) {
    this.values.set(key, value)
  }

  remove(key: string) {
    this.values.delete(key)
  }
}
