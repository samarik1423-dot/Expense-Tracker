import { CURRENCIES } from '../context/SettingsContext'

export function formatMoney(amount, currency = 'KGS') {
  const c = CURRENCIES[currency] || CURRENCIES.KGS
  return new Intl.NumberFormat(c.locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateStr, lang = 'ru') {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function isSameMonth(dateStr, ref = new Date()) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth()
}

export function sumByType(list, type, filter = () => true) {
  return list
    .filter((t) => t.type === type && filter(t))
    .reduce((acc, t) => acc + t.amount, 0)
}
