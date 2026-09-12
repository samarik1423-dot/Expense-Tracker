import { Link } from 'react-router-dom'
import { ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react'
import { useExpenses } from '../context/ExpensesContext'
import { useSettings } from '../context/SettingsContext'
import { translations } from '../i18n'
import { formatMoney, formatDate, isSameMonth, sumByType } from '../utils/format'
import AnimatedNumber from '../components/AnimatedNumber'
import CategoryIcon, { CATEGORY_COLORS } from '../components/CategoryIcon'
import DonutChart from '../components/DonutChart'
import BarChart from '../components/BarChart'
import { useState } from 'react'
import TransactionModal from '../components/TransactionModal'

export default function Dashboard() {
  const { transactions, add } = useExpenses()
  const { settings } = useSettings()
  const t = translations[settings.lang]
  const [modalOpen, setModalOpen] = useState(false)

  const now = new Date()
  const income = sumByType(transactions, 'income', (t2) => isSameMonth(t2.date, now))
  const expense = sumByType(transactions, 'expense', (t2) => isSameMonth(t2.date, now))
  const balance = sumByType(transactions, 'income') - sumByType(transactions, 'expense')

  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const prevExpense = sumByType(transactions, 'expense', (t2) => isSameMonth(t2.date, prev))
  const delta = prevExpense ? Math.round(((expense - prevExpense) / prevExpense) * 100) : 0

  const week = [...Array(7)].map((_, i) => {
    const d = new Date(now.getTime() - (6 - i) * 86400000)
    const key = d.toISOString().slice(0, 10)
    const value = sumByType(transactions, 'expense', (t2) => t2.date === key)
    return {
      label: d.toLocaleDateString(settings.lang === 'ru' ? 'ru-RU' : 'en-US', { weekday: 'short' }),
      value,
    }
  })

  const byCat = Object.entries(
    transactions
      .filter((t2) => t2.type === 'expense' && isSameMonth(t2.date, now))
      .reduce((acc, t2) => {
        acc[t2.category] = (acc[t2.category] || 0) + t2.amount
        return acc
      }, {})
  )
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => b.value - a.value)

  const recent = transactions.slice(0, 6)

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">{t.dashboard.greeting}</p>
          <h1>{t.nav.dashboard}</h1>
        </div>
      </header>

      <section className="cards-row">
        <div className="card balance-card">
          <span className="card-label">{t.dashboard.balance}</span>
          <h2>
            <AnimatedNumber value={balance} format={(v) => formatMoney(v, settings.currency)} />
          </h2>
        </div>
        <Link to="/income" className="card link-card">
          <span className="card-label">
            <i className="dot" style={{ background: '#4fc98f' }} />
            {t.dashboard.incomeMonth}
            <ArrowUpRight size={15} className="card-arrow" />
          </span>
          <h3 className="income">
            <ArrowUpRight size={16} />{' '}
            <AnimatedNumber value={income} format={(v) => formatMoney(v, settings.currency)} />
          </h3>
        </Link>
        <Link to="/expenses" className="card link-card">
          <span className="card-label">
            <i className="dot" style={{ background: '#e86a6a' }} />
            {t.dashboard.expenseMonth}
            <ArrowUpRight size={15} className="card-arrow" />
          </span>
          <h3 className="expense">
            <ArrowDownRight size={16} />{' '}
            <AnimatedNumber value={expense} format={(v) => formatMoney(v, settings.currency)} />
          </h3>
          <span className="muted small">
            {Math.abs(delta)}% {delta >= 0 ? t.dashboard.up : t.dashboard.down} · {t.dashboard.vsLastMonth}
          </span>
        </Link>
      </section>

      <section className="grid-2">
        <div className="card">
          <div className="card-head">
            <h3>{t.dashboard.weekTrend}</h3>
          </div>
          <BarChart data={week} />
        </div>

        <div className="card">
          <div className="card-head">
            <h3>{t.dashboard.byCategory}</h3>
          </div>
          {byCat.length ? (
            <div className="donut-flex">
              <DonutChart data={byCat} />
              <ul className="legend">
                {byCat.slice(0, 5).map((c) => (
                  <li key={c.key}>
                    <i style={{ background: CATEGORY_COLORS[c.key] }} />
                    <span>{t.categories[c.key]}</span>
                    <b>{formatMoney(c.value, settings.currency)}</b>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="muted">{t.dashboard.noData}</p>
          )}
        </div>
      </section>

      <section className="card">
        <div className="card-head">
          <h3>{t.dashboard.recent}</h3>
          <Link to="/transactions" className="link">
            {t.dashboard.viewAll} →
          </Link>
        </div>
        {recent.length ? (
          <ul className="tx-list">
            {recent.map((tx) => (
              <li key={tx.id}>
                <CategoryIcon category={tx.category} />
                <div className="tx-main">
                  <b>{tx.title}</b>
                  <span className="muted small">{formatDate(tx.date, settings.lang)}</span>
                </div>
                <span className={tx.type === 'income' ? 'amount income' : 'amount expense'}>
                  {tx.type === 'income' ? '+' : '−'}
                  {formatMoney(tx.amount, settings.currency)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty">
            <p className="muted">{t.dashboard.noData}</p>
            <button className="btn primary" onClick={() => setModalOpen(true)}>
              <Plus size={16} /> {t.dashboard.addFirst}
            </button>
          </div>
        )}
      </section>

      {modalOpen && (
        <TransactionModal
          t={{
            ...t.modal,
            typeIncome: t.transactions.income,
            typeExpense: t.transactions.expense,
            cats: t.categories,
          }}
          onClose={() => setModalOpen(false)}
          onSave={add}
        />
      )}
    </div>
  )
}
