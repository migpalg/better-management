import { useSyncExternalStore } from 'react'
import {
  getTheme,
  setTheme,
  subscribeToTheme,
} from '@/features/common/utils/theme/theme.ts'

export function useTheme() {
  const theme = useSyncExternalStore(subscribeToTheme, getTheme)

  return { theme, setTheme }
}
