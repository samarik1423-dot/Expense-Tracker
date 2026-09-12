import { useEffect, useState } from 'react'
import { CATEGORY_COLORS } from './CategoryIcon'
import { fromKGS } from '../utils/money'
import { useSettings, CURRENCIES } from '../context/SettingsContext'

const R = 52
const C = 2 * Math.PI * R

export default function DonutChart({ data, size = 180, thickness = 18, label = 'total' }) {
  const [animated, setAnimated] = useState(false)
  const { settings } = useSettings()
  const currency = settings.currency
  const symbol = CURRENCIES[currency]?.symbol || ''

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 60)
    return () => clearTimeout(t)
  }, [])

  const total = data.reduce((a, d) => a + d.value, 0)
  // Конвертируем сумму из KGS в выбранную валюту
  const displayTotal = total ? fromKGS(total, currency) : 0
  const displayText = displayTotal
    ? `${Math.round(displayTotal).toLocaleString('ru-RU')} ${symbol}`.trim()
    : '—'

  return (
    <div className="donut-wrap">
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        className="donut"
        style={{ transform: animated ? 'scale(1)' : 'scale(.85)', opacity: animated ? 1 : 0 }}
      >
        {data.reduce((els, d, idx) => {
          const frac = total ? d.value / total : 0
          const len = frac * C
          const offset = data.slice(0, idx).reduce((sum, item) => sum + (total ? item.value / total * C : 0), 0)
          const el = (
            <circle
              key={d.key}
              cx="60"
              cy="60"
              r={R}
              fill="none"
              stroke={CATEGORY_COLORS[d.key] || '#999'}
              strokeWidth={thickness}
              strokeDasharray={`${animated ? len : 0} ${C}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
              style={{ transition: 'stroke-dasharray .9s cubic-bezier(.22,1,.36,1)' }}
            />
          )
          return [...els, el]
        }, [])}
        <text x="60" y="57" textAnchor="middle" className="donut-total">
          {displayText}
        </text>
        <text x="60" y="72" textAnchor="middle" className="donut-label">
          {label}
        </text>
      </svg>
    </div>
  )
}