'use client'

import { useCart } from '@/lib/cart-context'
import Link from 'next/link'
import { useState } from 'react'

export function CartTotal() {
  const { total, items, resetCart } = useCart()
  const [isHovering, setIsHovering] = useState(false)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  if (itemCount === 0) return null

  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-2">
      <Link 
        href="/cart"
        className="bg-eggplant text-creamsicle px-6 py-3 rounded-full shadow-lg hover:bg-eggplant/90 transition-colors"
      >
        <div className="font-quicksand font-bold">
          {itemCount} {itemCount === 1 ? 'item' : 'items'} •{' '}
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(total)}
        </div>
      </Link>
      <div className="relative">
        <button
          onClick={resetCart}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="bg-eggplant text-creamsicle w-10 h-10 rounded-full shadow-lg hover:bg-eggplant/90 transition-colors flex items-center justify-center font-bold text-xl"
          aria-label="Clear cart"
        >
          ×
        </button>
        <div 
          className={`absolute right-full mr-2 whitespace-nowrap bg-eggplant text-creamsicle px-4 py-2 rounded-full transform transition-all duration-300 font-quicksand font-bold ${
            isHovering 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 translate-x-4 pointer-events-none'
          }`}
        >
          Clear Cart
        </div>
      </div>
    </div>
  )
} 