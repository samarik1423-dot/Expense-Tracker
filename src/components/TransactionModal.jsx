import { useState } from 'react'
import Modal from './Modal'
import { CATEGORY_KEYS, CATEGORY_COLORS } from './CategoryIcon'
import { useSettings } from '../context/SettingsContext'
import { toKGS } from '../utils/money'

export default function TransactionModal({ t, onClose, onSave }) {
  const { settings } = useSettings()
  const [form, setForm] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: 'food',
    date: new Date().toISOString().slice(0, 10),
  })
  const [error, setError] = useState('')

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    const amount = parseFloat(form.amount)
    if (!form.title.trim()) return setError(t.title + ' ⚠')
    if (!amount || amount <= 0) return setError(t.amount + ' ⚠')
    onSave({
      title: form.title.trim(),
      amount: toKGS(amount, settings.currency), // храним всё в сомах
      type: form.type,
      category: form.category,
      date: form.date,
    })
    onClose()
  }

  return (
    <Modal title={t.newTransaction} onClose={onClose}>
      <form className="form" onSubmit={submit}>
        <label>
          <span>{t.title}</span>
          <input value={form.title} onChange={set('title')} placeholder={t.titlePh} autoFocus />
        </label>
        <label>
          <span>{t.amount} ({settings.currency})</span>
          <input
            type="number"
            min="0"
            step="any"
            value={form.amount}
            onChange={set('amount')}
            placeholder="0"
          />
        </label>
        <div className="type-switch">
          {['expense', 'income'].map((tp) => (
            <button
              key={tp}
              type="button"
              className={form.type === tp ? 'active ' + tp : tp}
              onClick={() => setForm((f) => ({ ...f, type: tp }))}
            >
              {tp === 'income' ? t.typeIncome : t.typeExpense}
            </button>
          ))}
        </div>
        <label>
          <span>{t.category}</span>
          <div className="chip-grid">
            {CATEGORY_KEYS.map((c) => (
              <button
                key={c}
                type="button"
                className={`chip ${form.category === c ? 'active' : ''}`}
                onClick={() => setForm((f) => ({ ...f, category: c }))}
              >
                <i style={{ background: CATEGORY_COLORS[c] }} />
                {t.cats[c]}
              </button>
            ))}
          </div>
        </label>
        <label>
          <span>{t.date}</span>
          <input type="date" value={form.date} onChange={set('date')} />
        </label>
        {error && <div className="form-error">{error}</div>}
        <div className="modal-actions">
          <button type="button" className="btn ghost" onClick={onClose}>
            {t.cancel}
          </button>
          <button type="submit" className="btn primary">
            {t.save}
          </button>
        </div>
      </form>
    </Modal>
  )
}
