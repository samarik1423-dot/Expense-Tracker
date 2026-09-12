import { useEffect, useState } from 'react'
import { useSettings, CURRENCIES } from '../context/SettingsContext'
import { fromKGS } from '../utils/money'

export default function BarChart({ data, height = 180, color = 'var(--accent)' }) {
  const [mounted, setMounted] = useState(false)
  const { settings } = useSettings()
  const currency = settings.currency
  const symbol = CURRENCIES[currency]?.symbol || ''

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(t)
  }, [])

  const max = Math.max(...data.map((d) => d.value), 1)

  // Значение в выбранной валюте (data приходит в KGS)
  const formatValue = (kgs) => {
    const v = fromKGS(kgs, currency)
    const rounded = v >= 100 ? Math.round(v) : Math.round(v * 10) / 10
    return `${rounded.toLocaleString('ru-RU')} ${symbol}`.trim()
  }

  return (
    <div className="barchart" style={{ height }}>
      {data.map((d, i) => (
        <div className="bar-col" key={i}>
          {/* Обёртка повторяет высоту столбика — подсказка всегда прилипает к его верхушке */}
          <div
            className="bar-area"
            style={{
              height: mounted && d.value ? `${(d.value / max) * 100}%` : '4px',
              transitionDelay: `${i * 45}ms`,
            }}
          >
            <div className="bar-tip">{d.value ? formatValue(d.value) : ''}</div>
            <div
              className="bar"
              style={{
                background: color,
                transitionDelay: `${i * 45}ms`,
              }}
            />
          </div>
          <div className="bar-label">{d.label}</div>
        </div>
      ))}
    </div>
  )
}