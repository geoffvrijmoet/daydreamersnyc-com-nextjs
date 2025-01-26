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
      className="px-4 py-2 text-sm font-quicksand text-red-500 hover:text-red-600"
    >
      Clear Cart
    </button>
  )
} 