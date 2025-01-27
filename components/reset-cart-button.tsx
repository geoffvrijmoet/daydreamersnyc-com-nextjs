'use client'

import { useCart } from '@/lib/cart-context'

export function ResetCartButton() {
  const { resetCart, items } = useCart()

  if (items.length === 0) return null

  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      resetCart()
    }
  }

  return (
    <button
      onClick={handleReset}
      className="bg-red-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-red-600 transition-colors font-quicksand font-bold"
    >
      Clear Cart
    </button>
  )
} 