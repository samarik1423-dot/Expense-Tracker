import { useState } from 'react'
import Modal from './Modal'
import { useAuth } from '../context/AuthContext'
import { useSettings } from '../context/SettingsContext'
import { translations } from '../i18n'

// Маппинг ошибок Firebase на понятные сообщения из i18n
function mapError(code, t) {
  switch (code) {
    case 'auth/email-already-in-use':
      return t.emailInUse
    case 'auth/weak-password':
      return t.weakPassword
    case 'auth/invalid-email':
      return t.invalidEmail
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return t.wrongCredentials
    default:
      return t.authError
  }
}

export default function AuthModal({ mode, onClose }) {
  const { login, register } = useAuth()
  const { settings } = useSettings()
  const t = translations[settings.lang === 'en' ? 'en' : 'ru'].auth

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const isLogin = mode === 'login'

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (isLogin) {
        await login(email.trim(), password)
      } else {
        await register(email.trim(), password)
      }
      onClose()
    } catch (err) {
      setError(mapError(err?.code, t))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal title={isLogin ? t.login : t.register} onClose={onClose}>
      <form className="form" onSubmit={onSubmit}>
        <label>
          {t.email}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
            autoComplete="email"
          />
        </label>
        <label>
          {t.password}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
          />
        </label>
        {error && <span className="form-error">{error}</span>}
        <div className="modal-actions">
          <button type="button" className="btn ghost" onClick={onClose}>
            {t.cancel}
          </button>
          <button type="submit" className="btn primary" disabled={busy}>
            {busy ? '…' : isLogin ? t.login : t.register}
          </button>
        </div>
      </form>
    </Modal>
  )
}