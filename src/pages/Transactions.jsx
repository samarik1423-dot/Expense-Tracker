import { useMemo, useState } from 'react'
import { Plus, Trash2, Search } from 'lucide-react'
import { useExpenses } from '../context/ExpensesContext'
import { useSettings } from '../context/SettingsContext'
import { translations } from '../i18n'
import { formatMoney, formatDate } from '../utils/format'
import CategoryIcon, { CATEGORY_KEYS } from '../components/CategoryIcon'
import TransactionModal from '../components/TransactionModal'

const FILTERS = ['all', 'income', 'expense']

export default function Transactions() {
  const { transactions, add, remove } = useExpenses()
  const { settings } = useSettings()
  const t = translations[settings.lang]
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [category, setCategory] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)

  const list = useMemo(
    () =>
      transactions.filter(
        (tx) =>
          (filter === 'all' || tx.type === filter) &&
          (category === 'all' || tx.category === category) &&
          tx.title.toLowerCase().includes(query.toLowerCase())
      ),
    [transactions, query, filter, category]
  )

  const total = list.reduce((a, tx) => a + (tx.type === 'income' ? tx.amount : -tx.amount), 0)

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>{t.transactions.title}</h1>
          <p className="muted">
            {list.length} ·{' '}
            <span className={total >= 0 ? 'income' : 'expense'}>
              {total >= 0 ? '+' : '−'}
              {formatMoney(Math.abs(total), settings.currency)}
            </span>
          </p>
        </div>
        <button className="btn primary" onClick={() => setModalOpen(true)}>
          <Plus size={18} /> {t.transactions.add}
        </button>
      </header>

      <div className="toolbar">
        <div className="search">
          <Search size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.transactions.search}
          />
        </div>
        <div className="seg">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={filter === f ? 'active' : ''}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? t.transactions.all : f === 'income' ? t.transactions.income : t.transactions.expense}
            </button>
          ))}
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="select">
          <option value="all">{t.categories.other}…</option>
          {CATEGORY_KEYS.map((c) => (
            <option key={c} value={c}>
              {t.categories[c]}
            </option>
          ))}
        </select>
      </div>

      {list.length ? (
        <ul className="tx-list card list-card">
          {list.map((tx) => (
            <li key={tx.id} className="tx-row">
              <CategoryIcon category={tx.category} />
              <div className="tx-main">
                <b>{tx.title}</b>
                <span className="muted small">
                  {t.categories[tx.category]} · {formatDate(tx.date, settings.lang)}
                </span>
              </div>
              <span className={tx.type === 'income' ? 'amount income' : 'amount expense'}>
                {tx.type === 'income' ? '+' : '−'}
                {formatMoney(tx.amount, settings.currency)}
              </span>
              <button className="icon-btn danger" onClick={() => remove(tx.id)} title={t.transactions.delete}>
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="card empty">
          <p className="muted">{t.transactions.empty}</p>
        </div>
      )}

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
