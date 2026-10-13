import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getTheme,
  initTheme,
  resolveTheme,
  setTheme,
  subscribeToTheme,
} from './theme.ts'

function mockSystemTheme(initial: 'light' | 'dark') {
  let matches = initial === 'dark'
  const listeners = new Set<() => void>()

  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      get matches() {
        return matches
      },
      addEventListener: (_: string, listener: () => void) =>
        listeners.add(listener),
      removeEventListener: (_: string, listener: () => void) =>
        listeners.delete(listener),
    })),
  )

  return {
    change(next: 'light' | 'dark') {
      matches = next === 'dark'
      listeners.forEach((listener) => listener())
    },
  }
}

function isDark() {
  return document.documentElement.classList.contains('dark')
}

describe('theme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
    mockSystemTheme('light')
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('getTheme', () => {
    it('defaults to system when nothing is stored', () => {
      expect(getTheme()).toBe('system')
    })

    it('returns the stored theme', () => {
      localStorage.setItem('theme', 'dark')

      expect(getTheme()).toBe('dark')
    })

    it('ignores invalid stored values', () => {
      localStorage.setItem('theme', 'purple')

      expect(getTheme()).toBe('system')
    })
  })

  describe('resolveTheme', () => {
    it('returns explicit themes as-is', () => {
      expect(resolveTheme('dark')).toBe('dark')
      expect(resolveTheme('light')).toBe('light')
    })

    it('resolves system using the OS preference', () => {
      mockSystemTheme('dark')

      expect(resolveTheme('system')).toBe('dark')
    })
  })

  describe('setTheme', () => {
    it('persists the theme and toggles the dark class', () => {
      setTheme('dark')

      expect(localStorage.getItem('theme')).toBe('dark')
      expect(isDark()).toBe(true)

      setTheme('light')

      expect(isDark()).toBe(false)
    })

    it('follows the OS preference for system', () => {
      mockSystemTheme('dark')

      setTheme('system')

      expect(isDark()).toBe(true)
    })

    it('notifies subscribers until they unsubscribe', () => {
      const listener = vi.fn()
      const unsubscribe = subscribeToTheme(listener)

      setTheme('dark')
      unsubscribe()
      setTheme('light')

      expect(listener).toHaveBeenCalledTimes(1)
    })
  })

  describe('initTheme', () => {
    it('applies the stored theme', () => {
      localStorage.setItem('theme', 'dark')

      const cleanup = initTheme()

      expect(isDark()).toBe(true)
      cleanup()
    })

    it('reacts to OS changes when the theme is system', () => {
      const system = mockSystemTheme('light')
      const cleanup = initTheme()

      system.change('dark')

      expect(isDark()).toBe(true)
      cleanup()
    })

    it('ignores OS changes when an explicit theme is set', () => {
      localStorage.setItem('theme', 'light')
      const system = mockSystemTheme('light')
      const cleanup = initTheme()

      system.change('dark')

      expect(isDark()).toBe(false)
      cleanup()
    })

    it('stops reacting to OS changes after cleanup', () => {
      const system = mockSystemTheme('light')
      const cleanup = initTheme()

      cleanup()
      system.change('dark')

      expect(isDark()).toBe(false)
    })
  })
})
