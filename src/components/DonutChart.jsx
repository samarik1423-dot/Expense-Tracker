import { useEffect, useState } from 'react'
import { CATEGORY_COLORS } from './CategoryIcon'

const R = 52
const C = 2 * Math.PI * R

export default function DonutChart({ data, size = 180, thickness = 18 }) {
  const [animated, setAnimated] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 60)
    return () => clearTimeout(t)
  }, [])

  const total = data.reduce((a, d) => a + d.value, 0)
  let offset = 0

  return (
    <div className="donut-wrap">
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        className="donut"
        style={{ transform: animated ? 'scale(1)' : 'scale(.85)', opacity: animated ? 1 : 0 }}
      >
        {data.map((d) => {
          const frac = total ? d.value / total : 0
          const len = frac * C
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
          offset += len
          return el
        })}
        <text x="60" y="57" textAnchor="middle" className="donut-total">
          {total ? Math.round(total).toLocaleString('ru-RU') : '—'}
        </text>
        <text x="60" y="72" textAnchor="middle" className="donut-label">
          total
        </text>
      </svg>
    </div>
  )
}
