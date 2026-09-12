import {
  ShoppingCart, Car, Home, Clapperboard, HeartPulse, ShoppingBag,
  Briefcase, Laptop, MoreHorizontal,
} from 'lucide-react'

const MAP = {
  food: ShoppingCart,
  transport: Car,
  housing: Home,
  fun: Clapperboard,
  health: HeartPulse,
  shopping: ShoppingBag,
  salary: Briefcase,
  freelance: Laptop,
  other: MoreHorizontal,
}

// eslint-disable-next-line react-refresh/only-export-components
export const CATEGORY_KEYS = Object.keys(MAP)

// eslint-disable-next-line react-refresh/only-export-components
export const CATEGORY_COLORS = {
  food: '#6aa84f',
  transport: '#4f8fe8',
  housing: '#b08be8',
  fun: '#f2a54b',
  health: '#e86a6a',
  shopping: '#e86ab8',
  salary: '#4fc98f',
  freelance: '#4fd0d0',
  other: '#9aa4b2',
}

export default function CategoryIcon({ category, size = 18 }) {
  const Icon = MAP[category] || MoreHorizontal
  const color = CATEGORY_COLORS[category] || CATEGORY_COLORS.other
  return (
    <span className="cat-icon" style={{ background: color + '1f', color }}>
      <Icon size={size} strokeWidth={2} />
    </span>
  )
}
