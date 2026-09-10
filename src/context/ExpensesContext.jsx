import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { seedTransactions } from '../data/seed'

const ExpensesContext = createContext(null)

const STORAGE_KEY = 'pulse-transactions'

export function ExpensesProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) return JSON.parse(raw)
    } catch { /* ignore */ }
    return seedTransactions()
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
  }, [transactions])

  const add = (tx) =>
    setTransactions((list) => [{ id: crypto.randomUUID(), ...tx }, ...list])

  const remove = (id) =>
    setTransactions((list) => list.filter((t) => t.id !== id))

  const reset = () => setTransactions(seedTransactions())

  const value = useMemo(
    () => ({ transactions, add, remove, reset }),
    [transactions]
  )

  return (
    <ExpensesContext.Provider value={value}>{children}</ExpensesContext.Provider>
  )
}

export const useExpenses = () => useContext(ExpensesContext)
