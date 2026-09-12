import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { auth } from '../firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  // Регистрация по email и паролю
  const register = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password)

  // Вход по email и паролю
  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password)

  const logout = () => signOut(auth)

  const updateUserProfile = (data) => {
    if (!auth.currentUser) return Promise.resolve()
    return updateProfile(auth.currentUser, data).then(() => {
      // триггерим обновление состояния пользователя
      setUser({ ...auth.currentUser })
    })
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)