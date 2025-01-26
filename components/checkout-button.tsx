'use client'

import { useCart } from '@/lib/cart-context'

export function CheckoutButton() {
  const { items } = useCart()

  if (items.length === 0) return null

  return (
    <button 
      className="w-full py-3 bg-eggplant text-creamsicle font-quicksand font-bold rounded-lg hover:bg-eggplant/90"
      onClick={() => {
        // Checkout logic here
      }}
    >
      Proceed to Checkout
    </button>
  )
} 