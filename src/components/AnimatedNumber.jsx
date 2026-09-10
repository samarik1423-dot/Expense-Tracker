import { useEffect, useRef, useState } from 'react'

export default function AnimatedNumber({ value, format }) {
  const [display, setDisplay] = useState(value)
  const prev = useRef(value)
  const raf = useRef()

  useEffect(() => {
    const from = prev.current
    const to = value
    prev.current = value
    if (from === to) {
      setDisplay(to)
      return
    }
    const start = performance.now()
    const dur = 600
    const tick = (t) => {
      const p = Math.min((t - start) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(Math.round(from + (to - from) * eased))
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [value])

  return <span>{format(display)}</span>
}
