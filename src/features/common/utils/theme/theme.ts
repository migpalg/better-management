export type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'theme'
const DARK_QUERY = '(prefers-color-scheme: dark)'

const listeners = new Set<() => void>()

function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark' || value === 'system'
}

export function getTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return isTheme(stored) ? stored : 'system'
  } catch {
    return 'system'
  }
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
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Storage can be unavailable (private mode); the theme still applies.
  }
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
