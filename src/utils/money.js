// Все суммы в приложении хранятся в KGS (сомы) — это базовая валюта.
// При отображении конвертируем в выбранную валюту по фиксированным курсам.
// Обнови курсы здесь при необходимости.
export const RATES_TO_KGS = {
  KGS: 1,
  USD: 87,
  EUR: 95,
}

export function toKGS(amount, currency) {
  return Math.round(amount * (RATES_TO_KGS[currency] || 1))
}

export function fromKGS(amountKGS, currency) {
  return amountKGS / (RATES_TO_KGS[currency] || 1)
}
