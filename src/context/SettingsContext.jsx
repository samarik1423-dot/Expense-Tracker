import { createContext, useContext, useEffect, useState } from 'react'

const SettingsContext = createContext(null)

// eslint-disable-next-line react-refresh/only-export-components
export const CURRENCIES = {
  KGS: { symbol: 'с', locale: 'ru-RU' },
  USD: { symbol: '$', locale: 'en-US' },
  EUR: { symbol: '€', locale: 'de-DE' },
}

const DEFAULTS = {
  theme: 'light',
  lang: 'ru',
  font: 'manrope',
  currency: 'KGS',
  avatar: null, // base64-изображение, загружается в настройках
}

const FONTS = {
  inter: "'Inter', system-ui, sans-serif",
  manrope: "'Manrope', system-ui, sans-serif",
  mono: "'JetBrains Mono', monospace",
  unbounded: "'Unbounded', sans-serif",
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('pulse-settings')) || {}
      if (saved.currency && !CURRENCIES[saved.currency]) saved.currency = DEFAULTS.currency
      if (saved.theme && !['light', 'dark'].includes(saved.theme)) saved.theme = DEFAULTS.theme
      if (saved.lang && !['ru', 'en'].includes(saved.lang)) saved.lang = DEFAULTS.lang
      return { ...DEFAULTS, ...saved }
    } catch {
      return DEFAULTS
    }
  })

  useEffect(() => {
    localStorage.setItem('pulse-settings', JSON.stringify(settings))
    document.documentElement.dataset.theme = settings.theme
    document.documentElement.dataset.font = settings.font
    document.documentElement.lang = settings.lang === 'ru' ? 'ru' : 'en'
    document.documentElement.style.setProperty('--font', FONTS[settings.font] || FONTS.manrope)
  }, [settings])

  const update = (patch) => setSettings((s) => ({ ...s, ...patch }))

  return (
    <SettingsContext.Provider value={{ settings, update }}>
      {children}
    </SettingsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSettings = () => useContext(SettingsContext)
