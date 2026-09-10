import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard, TrendingUp, TrendingDown, ArrowLeftRight,
  PieChart, Settings as SettingsIcon, Plus,
} from 'lucide-react'
import { useSettings } from '../context/SettingsContext'
import { useExpenses } from '../context/ExpensesContext'
import { translations } from '../i18n'
import TransactionModal from './TransactionModal'

const NAV = [
  { to: '/', icon: LayoutDashboard, key: 'dashboard' },
  { to: '/income', icon: TrendingUp, key: 'income' },
  { to: '/expenses', icon: TrendingDown, key: 'expenses' },
  { to: '/transactions', icon: ArrowLeftRight, key: 'transactions' },
  { to: '/analytics', icon: PieChart, key: 'analytics' },
  { to: '/settings', icon: SettingsIcon, key: 'settings' },
]

export default function Layout() {
  const { settings } = useSettings()
  const { add } = useExpenses()
  const t = translations[settings.lang]
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <span className="logo-dot" />
          {t.appName}
        </div>
        <nav>
          {NAV.map(({ to, icon: Icon, key }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
            >
              <Icon size={19} strokeWidth={2} />
              <span>{t.nav[key]}</span>
            </NavLink>
          ))}
        </nav>
        <button className="btn primary add-btn" onClick={() => setModalOpen(true)}>
          <Plus size={18} /> {t.transactions.add}
        </button>
        <div className="sidebar-foot">pulse © 2026</div>
      </aside>
      <main className="content">
        <div className="page-fade">
          <Outlet />
        </div>
      </main>
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
