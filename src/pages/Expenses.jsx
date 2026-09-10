import { Link } from 'react-router-dom'
import { useExpenses } from '../context/ExpensesContext'
import { useSettings } from '../context/SettingsContext'
import { translations } from '../i18n'
import { formatMoney, formatDate } from '../utils/format'
import AnimatedNumber from '../components/AnimatedNumber'
import CategoryIcon, { CATEGORY_COLORS } from '../components/CategoryIcon'

export default function Expenses() {
  const { transactions } = useExpenses()
  const { settings } = useSettings()
  const t = translations[settings.lang]
  const pt = t.expensePage

  const list = transactions.filter((tx) => tx.type === 'expense')
  const total = list.reduce((a, tx) => a + tx.amount, 0)

  const byCat = Object.entries(
    list.reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount
      return acc
    }, {})
  )
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => b.value - a.value)

  return (
    <div className="page">
      <header className="page-head">
        <h1>{pt.title}</h1>
        <Link to="/transactions" className="link">
          {t.dashboard.viewAll} →
        </Link>
      </header>

      <section className="cards-row">
        <div className="card stat-card">
          <span className="card-label">
            <i className="dot" style={{ background: '#e86a6a' }} />
            {pt.total}
          </span>
          <h3 className="expense">
            <span className="arrow">−</span>{' '}
            <AnimatedNumber value={total} format={(v) => formatMoney(v, settings.currency)} />
          </h3>
        </div>
        <div className="card stat-card">
          <span className="card-label">{pt.count}</span>
          <h3>
            <AnimatedNumber value={list.length} format={(v) => v} />
          </h3>
        </div>
        <div className="card stat-card">
          <span className="card-label">{pt.byCategory}</span>
          <h3 className="plain-list">
            {byCat.slice(0, 2).map((c) => (
              <span key={c.key} className="muted small cat-inline">
                <i style={{ background: CATEGORY_COLORS[c.key] }} />
                {t.categories[c.key]}
              </span>
            ))}
          </h3>
        </div>
      </section>

      <section className="card">
        <div className="card-head">
          <h3>{pt.byCategory}</h3>
        </div>
        {byCat.length ? (
          <ul className="legend wide">
            {byCat.map((c) => {
              const pct = total ? Math.round((c.value / total) * 100) : 0
              return (
                <li key={c.key}>
                  <CategoryIcon category={c.key} size={16} />
                  <span>{t.categories[c.key]}</span>
                  <div className="pct-bar">
                    <div style={{ width: pct + '%', background: CATEGORY_COLORS[c.key] }} />
                  </div>
                  <b>{formatMoney(c.value, settings.currency)}</b>
                  <em>{pct}%</em>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="muted">{pt.empty}</p>
        )}
      </section>

      <section className="card">
        <div className="card-head">
          <h3>{pt.title}</h3>
        </div>
        {list.length ? (
          <ul className="tx-list">
            {list.slice(0, 20).map((tx) => (
              <li key={tx.id}>
                <CategoryIcon category={tx.category} />
                <div className="tx-main">
                  <b>{tx.title}</b>
                  <span className="muted small">{formatDate(tx.date, settings.lang)}</span>
                </div>
                <span className="amount expense">
                  <span className="arrow">−</span>{' '}
                  {formatMoney(tx.amount, settings.currency)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">{pt.empty}</p>
        )}
      </section>
    </div>
  )
}
