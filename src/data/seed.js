// Demo data, generated relative to "today" so charts always look alive.
const day = 86400000

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

// Запасной генератор ID для старых браузеров без crypto.randomUUID
export const makeId = () =>
  window.crypto?.randomUUID
    ? window.crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).slice(2, 10)

const expensePool = [
  ['Продукты в супермаркете', 'food', 1200, 4200],
  ['Кафе и рестораны', 'food', 800, 2600],
  ['Такси', 'transport', 300, 1500],
  ['Метро', 'transport', 100, 400],
  ['Квартира и ЖКХ', 'housing', 9000, 22000],
  ['Интернет и связь', 'housing', 700, 1400],
  ['Кино и концерты', 'fun', 900, 3500],
  ['Подписки', 'fun', 300, 1800],
  ['Аптека', 'health', 400, 2800],
  ['Спортзал', 'health', 1500, 3000],
  ['Одежда', 'shopping', 2000, 9000],
  ['Мелочи для дома', 'shopping', 500, 3000],
  ['Прочее', 'other', 200, 1500],
]

const incomePool = [
  ['Зарплата', 'salary', 80000, 140000],
  ['Проект на фрилансе', 'freelance', 8000, 45000],
]

const rand = (min, max) => Math.round(min + Math.random() * (max - min))

export function seedTransactions() {
  try {
    const now = new Date()
    const txs = []

    // income: salary on 5th of each of the last 3 months, freelance occasionally
    for (let m = 3; m >= 0; m--) {
      const d = new Date(now.getFullYear(), now.getMonth() - m, 5)
      if (d > now) continue
      const [title, category, min, max] = incomePool[0]
      txs.push({
        id: makeId(),
        title,
        category,
        type: 'income',
        amount: rand(min, max),
        date: d.toISOString().slice(0, 10),
      })
      if (Math.random() > 0.35) {
        const f = incomePool[1]
        const fd = new Date(now.getFullYear(), now.getMonth() - m, rand(12, 24))
        if (fd <= now)
          txs.push({
            id: makeId(),
            title: f[0],
            category: f[1],
            type: 'income',
            amount: rand(f[2], f[3]),
            date: fd.toISOString().slice(0, 10),
          })
      }
    }

    // expenses: 1-2 per day over the last ~45 days
    for (let i = 45; i >= 0; i--) {
      const count = Math.random() > 0.55 ? 0 : rand(1, 2)
      for (let k = 0; k < count; k++) {
        const [title, category, min, max] = pick(expensePool)
        const d = new Date(now.getTime() - i * day - rand(0, 10) * 3600000)
        if (d > now) continue
        txs.push({
          id: makeId(),
          title,
          category,
          type: 'expense',
          amount: rand(min, max),
          date: d.toISOString().slice(0, 10),
        })
      }
    }

    return txs.sort((a, b) => (a.date < b.date ? 1 : -1))
  } catch (e) {
    console.error('Seed failed:', e)
    return []
  }
}
