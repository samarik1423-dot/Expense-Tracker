import { useEffect, useState } from 'react'

export default function BarChart({ data, height = 180, color = 'var(--accent)' }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(t)
  }, [])

  const max = Math.max(...data.map((d) => d.value), 1)

  return (
    <div className="barchart" style={{ height }}>
      {data.map((d, i) => (
        <div className="bar-col" key={i}>
          <div className="bar-tip">{d.value ? d.value.toLocaleString('ru-RU') : ''}</div>
          <div
            className="bar"
            style={{
              height: mounted && d.value ? `${(d.value / max) * 100}%` : '4px',
              background: color,
              transitionDelay: `${i * 45}ms`,
            }}
          />
          <div className="bar-label">{d.label}</div>
        </div>
      ))}
    </div>
  )
}
