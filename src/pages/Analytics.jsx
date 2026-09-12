import { useMemo, useState } from 'react'
import { useExpenses } from '../context/ExpensesContext'
import { useSettings } from '../context/SettingsContext'
import { translations } from '../i18n'
import { formatMoney } from '../utils/format'
import DonutChart from '../components/DonutChart'
import BarChart from '../components/BarChart'
import { CATEGORY_COLORS } from '../components/CategoryIcon'
import AnimatedNumber from '../components/AnimatedNumber'

const PERIODS = ['week', 'month', 'year']

export default function Analytics() {
  const { transactions } = useExpenses()
  const { settings } = useSettings()
  const t = translations[settings.lang]
  const [period, setPeriod] = useState('month')

  const data = useMemo(() => {
    const now = new Date()
    let start, buckets
    if (period === 'week') {
      start = new Date(now.getTime() - 6 * 86400000)
      buckets = [...Array(7)].map((_, i) => {
        const d = new Date(start.getTime() + i * 86400000)
        return { key: d.toISOString().slice(0, 10), label: d.toLocaleDateString(settings.lang === 'ru' ? 'ru-RU' : 'en-US', { weekday: 'short' }) }
      })
    } else if (period === 'month') {
      start = new Date(now.getFullYear(), now.getMonth(), 1)
      const days = now.getDate()
      const size = Math.ceil(days / 6)
      buckets = [...Array(6)].map((_, i) => {
        const from = i * size + 1
        const to = Math.min((i + 1) * size, days)
        return { key: [from, to], label: `${from}–${to}` }
      })
    } else {
      start = new Date(now.getFullYear(), 0, 1)
      buckets = [...Array(12)].map((_, i) => ({
        key: i,
        label: new Date(now.getFullYear(), i, 1).toLocaleDateString(settings.lang === 'ru' ? 'ru-RU' : 'en-US', { month: 'short' }),
      }))
    }

    const inRange = (dateStr) => {
      const d = new Date(dateStr + 'T00:00:00')
      if (period === 'week') return d >= start
      if (period === 'month') return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
      return d.getFullYear() === now.getFullYear()
    }

    const inBucket = (dateStr, b) => {
      const d = new Date(dateStr + 'T00:00:00')
      if (period === 'week') return dateStr === b.key
      if (period === 'month') return d.getDate() >= b.key[0] && d.getDate() <= b.key[1]
      return d.getMonth() === b.key
    }

    const expenses = transactions.filter((tx) => tx.type === 'expense' && inRange(tx.date))
    const income = transactions.filter((tx) => tx.type === 'income' && inRange(tx.date))

    const bars = buckets.map((b) => ({
      label: b.label,
      value: expenses.filter((tx) => inBucket(tx.date, b)).reduce((a, tx) => a + tx.amount, 0),
    }))

    const byCat = Object.entries(
      expenses.reduce((acc, tx) => {
        acc[tx.category] = (acc[tx.category] || 0) + tx.amount
        return acc
      }, {})
    )
      .map(([key, value]) => ({ key, value }))
      .sort((a, b) => b.value - a.value)

    const days =
      period === 'week'
        ? 7
        : period === 'month'
        ? now.getDate()
        : Math.max(1, Math.floor((now - new Date(now.getFullYear(), 0, 1)) / 86400000))

    return {
      expenses,
      income,
      bars,
      byCat,
      totalExpense: expenses.reduce((a, tx) => a + tx.amount, 0),
      totalIncome: income.reduce((a, tx) => a + tx.amount, 0),
      top: byCat[0],
      avg: Math.round(expenses.reduce((a, tx) => a + tx.amount, 0) / days),
    }
  }, [transactions, period, settings.lang])

  return (
    <div className="page">
      <header className="page-head">
        <h1>{t.analytics.title}</h1>
        <div className="seg">
          {PERIODS.map((p) => (
            <button key={p} className={period === p ? 'active' : ''} onClick={() => setPeriod(p)}>
              {t.analytics[p]}
            </button>
          ))}
        </div>
      </header>

      <section className="cards-row four">
        {[
          { label: t.analytics.totalExpenses, value: data.totalExpense, cls: 'expense' },
          { label: t.analytics.totalIncome, value: data.totalIncome, cls: 'income' },
          { label: t.analytics.avgPerDay, value: data.avg, cls: '' },
          {
            label: t.analytics.topCategory,
            value: data.top ? data.top.value : 0,
            cls: '',
            extra: data.top ? t.categories[data.top.key] : '—',
          },
        ].map((s) => (
          <div className="card" key={s.label}>
            <span className="card-label">{s.label}</span>
            <h3 className={s.cls}>
              <AnimatedNumber value={s.value} format={(v) => formatMoney(v, settings.currency)} />
            </h3>
            {s.extra && <span className="muted small">{s.extra}</span>}
          </div>
        ))}
      </section>

      <section className="card">
        <div className="card-head">
          <h3>{t.analytics.dynamics}</h3>
        </div>
        <BarChart data={data.bars} />
      </section>

      <section className="card">
        <div className="card-head">
          <h3>{t.analytics.byCategory}</h3>
        </div>
        {data.byCat.length ? (
          <div className="donut-flex">
            <DonutChart data={data.byCat} />
            <ul className="legend">
              {data.byCat.map((c) => (
                <li key={c.key}>
                  <i style={{ background: CATEGORY_COLORS[c.key] }} />
                  <span>{t.categories[c.key]}</span>
                  <b>{formatMoney(c.value, settings.currency)}</b>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="muted">{t.analytics.noExpenses}</p>
        )}
      </section>
    </div>
  )
}
