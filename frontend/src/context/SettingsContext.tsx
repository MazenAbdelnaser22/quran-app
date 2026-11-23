import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface Settings {
  theme: Theme
  fontSize: number
  toggleTheme: () => void
  increaseFont: () => void
  decreaseFont: () => void
}

const MIN_FONT = 20
const MAX_FONT = 56
const STEP = 4

const SettingsContext = createContext<Settings | null>(null)

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => load<Theme>('theme', 'light'))
  const [fontSize, setFontSize] = useState<number>(() => load<number>('fontSize', 30))

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', JSON.stringify(theme))
  }, [theme])

  useEffect(() => {
    localStorage.setItem('fontSize', JSON.stringify(fontSize))
  }, [fontSize])

  const value: Settings = {
    theme,
    fontSize,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    increaseFont: () => setFontSize((s) => Math.min(MAX_FONT, s + STEP)),
    decreaseFont: () => setFontSize((s) => Math.max(MIN_FONT, s - STEP)),
  }

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider')
  return ctx
}