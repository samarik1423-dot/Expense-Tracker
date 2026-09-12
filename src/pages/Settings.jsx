import { useRef, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useSettings, CURRENCIES } from '../context/SettingsContext'
import { useExpenses } from '../context/ExpensesContext'
import { useAuth } from '../context/AuthContext'
import { translations } from '../i18n'

const FONTS = [
  { id: 'manrope', label: 'Manrope' },
  { id: 'inter', label: 'Inter' },
  { id: 'mono', label: 'JetBrains Mono' },
  { id: 'unbounded', label: 'Unbounded' },
]

export default function Settings() {
  const { settings, update } = useSettings()
  const { reset } = useExpenses()
  const { user } = useAuth()
  const t = translations[settings.lang]
  const fileRef = useRef()
  const avatarRef = useRef()
  const [notice, setNotice] = useState('')

  const flash = (msg) => {
    setNotice(msg)
    setTimeout(() => setNotice(''), 2500)
  }

  const onImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result)
        if (!Array.isArray(data)) throw new Error()
        localStorage.setItem('pulse-transactions', JSON.stringify(data))
        window.location.reload()
      } catch {
        flash(t.settings.importError)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const onExport = () => {
    const blob = new Blob([localStorage.getItem('pulse-transactions') || '[]'], {
      type: 'application/json',
    })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'pulse-transactions.json'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const onReset = () => {
    if (window.confirm(t.settings.resetConfirm)) {
      reset()
      window.location.reload()
    }
  }

  // Загрузка своего изображения для аватарки (хранится в настройках как base64)
  const onAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      flash(t.settings.importError)
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      // сжимаем через canvas, чтобы не раздувать localStorage
      const img = new Image()
      img.onload = () => {
        const size = 160
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')
        // обрезаем по центру в квадрат
        const min = Math.min(img.width, img.height)
        ctx.drawImage(
          img,
          (img.width - min) / 2,
          (img.height - min) / 2,
          min,
          min,
          0,
          0,
          size,
          size
        )
        update({ avatar: canvas.toDataURL('image/jpeg', 0.85) })
        flash(t.settings.avatarSaved)
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const onRemoveAvatar = () => update({ avatar: null })

  return (
    <div className="page narrow">
      <header className="page-head">
        <h1>{t.settings.title}</h1>
        {notice && <span className="notice">{notice}</span>}
      </header>

      {user && (
        <section className="card">
          <h3 className="card-title">{t.auth.profile}</h3>
          <div className="setting-row">
            <span>{t.auth.chooseAvatar}</span>
            <div className="avatar-row">
              {settings.avatar ? (
                <img className="avatar avatar-lg" src={settings.avatar} alt={t.auth.profile} />
              ) : (
                <span className="avatar avatar-lg avatar-fallback">
                  {(user.email || '?').charAt(0).toUpperCase()}
                </span>
              )}
              <div className="avatar-actions">
                <button className="btn ghost" onClick={() => avatarRef.current.click()}>
                  {t.auth.uploadAvatar}
                </button>
                {settings.avatar && (
                  <button className="icon-btn danger" onClick={onRemoveAvatar} title={t.settings.deleteAvatar}>
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <input
                ref={avatarRef}
                type="file"
                accept="image/*"
                hidden
                onChange={onAvatarChange}
              />
            </div>
          </div>
          <div className="setting-row">
            <span>{t.auth.email}</span>
            <span className="muted">{user.email}</span>
          </div>
        </section>
      )}

      <section className="card">
        <h3 className="card-title">{t.settings.appearance}</h3>
        <div className="setting-row">
          <span>{t.settings.theme}</span>
          <div className="seg">
            <button className={settings.theme === 'light' ? 'active' : ''} onClick={() => update({ theme: 'light' })}>
              {t.settings.light}
            </button>
            <button className={settings.theme === 'dark' ? 'active' : ''} onClick={() => update({ theme: 'dark' })}>
              {t.settings.dark}
            </button>
          </div>
        </div>
        <div className="setting-row">
          <span>{t.settings.font}</span>
          <div className="chip-grid fonts">
            {FONTS.map((f) => (
              <button
                key={f.id}
                className={`chip ${settings.font === f.id ? 'active' : ''}`}
                onClick={() => update({ font: f.id })}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="setting-row">
          <span>{t.settings.language}</span>
          <div className="seg">
            <button className={settings.lang === 'ru' ? 'active' : ''} onClick={() => update({ lang: 'ru' })}>
              Русский
            </button>
            <button className={settings.lang === 'en' ? 'active' : ''} onClick={() => update({ lang: 'en' })}>
              English
            </button>
          </div>
        </div>
      </section>

      <section className="card">
        <h3 className="card-title">{t.settings.regional}</h3>
        <div className="setting-row">
          <span>{t.settings.currency}</span>
          <div className="seg">
            {Object.keys(CURRENCIES).map((c) => (
              <button key={c} className={settings.currency === c ? 'active' : ''} onClick={() => update({ currency: c })}>
                {CURRENCIES[c].symbol} {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="card">
        <h3 className="card-title">{t.settings.data}</h3>
        <div className="setting-row wrap">
          <button className="btn ghost" onClick={onExport}>
            {t.settings.export}
          </button>
          <button className="btn ghost" onClick={() => fileRef.current.click()}>
            {t.settings.import}
          </button>
          <button className="btn danger" onClick={onReset}>
            {t.settings.reset}
          </button>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={onImport} />
        </div>
      </section>
    </div>
  )
}
