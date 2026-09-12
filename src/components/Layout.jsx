import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard, TrendingUp, TrendingDown, ArrowLeftRight,
  PieChart, Settings as SettingsIcon, Plus, LogOut,
} from 'lucide-react'
import { useSettings } from '../context/SettingsContext'
import { useExpenses } from '../context/ExpensesContext'
import { useAuth } from '../context/AuthContext'
import { translations } from '../i18n'
import TransactionModal from './TransactionModal'
import AuthModal from './AuthModal'

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
  const { user, logout } = useAuth()
  const t = translations[settings.lang]
  const [modalOpen, setModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState(null) // 'login' | 'register' | null

  // Аватарка: своя картинка из настроек → фото из Firebase → первая буква email
  const avatarSrc = settings.avatar || user?.photoURL || null
  const initial = (user?.email || '?').charAt(0).toUpperCase()

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <span className="logo-dot" aria-hidden="true" />
          {t.appName}
        </div>
        <nav aria-label={settings.lang === 'ru' ? 'Основная навигация' : 'Main navigation'}>
          {NAV.map(({ to, icon: Icon, key }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
            >
              <Icon size={19} strokeWidth={2} aria-hidden="true" />
              <span>{t.nav[key]}</span>
            </NavLink>
          ))}
        </nav>

        {/* Блок пользователя: до входа — две кнопки, после — аватарка */}
        {user ? (
          <div className="user-box">
            {avatarSrc ? (
              <img className="avatar" src={avatarSrc} alt={t.auth.profile} />
            ) : (
              <span className="avatar avatar-fallback">{initial}</span>
            )}
            <div className="user-info">
              <span className="user-name" title={user.email}>
                {user.displayName || user.email}
              </span>
              <button className="user-logout" onClick={logout}>
                <LogOut size={13} /> {t.auth.logout}
              </button>
            </div>
          </div>
        ) : (
          <div className="auth-buttons">
            <button className="btn primary" onClick={() => setAuthMode('login')}>
              {t.auth.login}
            </button>
            <button className="btn ghost" onClick={() => setAuthMode('register')}>
              {t.auth.register}
            </button>
          </div>
        )}

        <button className="btn primary add-btn" onClick={() => setModalOpen(true)}>
          <Plus size={18} aria-hidden="true" />
          <span className="add-btn-text">{t.transactions.add}</span>
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
      {authMode && (
        <AuthModal mode={authMode} onClose={() => setAuthMode(null)} />
      )}
    </div>
  )
}