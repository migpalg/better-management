import { LocalStorage } from '@/features/common/key-value-storage/local-storage/local-storage.ts'

export type Theme = 'light' | 'dark' | 'system'

const storage = new LocalStorage()
const STORAGE_KEY = 'theme'
const DARK_QUERY = '(prefers-color-scheme: dark)'

const listeners = new Set<() => void>()

function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark' || value === 'system'
}

export function getTheme(): Theme {
  const stored = storage.get(STORAGE_KEY)
  return isTheme(stored) ? stored : 'system'
}

export function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme !== 'system') return theme
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light'
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle(
    'dark',
    resolveTheme(theme) === 'dark',
  )
}

export function setTheme(theme: Theme) {
  storage.set(STORAGE_KEY, theme)
  applyTheme(theme)
  listeners.forEach((listener) => listener())
}

export function subscribeToTheme(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/**
 * Applies the saved theme and keeps `system` in sync with OS changes.
 * Call once at startup; returns a cleanup function.
 */
export function initTheme() {
  applyTheme(getTheme())

  const media = window.matchMedia(DARK_QUERY)
  const handleChange = () => {
    if (getTheme() === 'system') applyTheme('system')
  }
  media.addEventListener('change', handleChange)

  return () => media.removeEventListener('change', handleChange)
}
