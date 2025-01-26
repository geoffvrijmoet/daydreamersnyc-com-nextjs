'use client'

import { useCart } from '@/lib/cart-context'
import Link from 'next/link'

export function CartTotal() {
  const { total, items } = useCart()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  if (itemCount === 0) return null

  return (
    <Link 
      href="/cart"
      className="fixed bottom-4 right-4 bg-eggplant text-creamsicle px-6 py-3 rounded-full shadow-lg hover:bg-eggplant/90 transition-colors"
    >
      <div className="font-quicksand font-bold">
        {itemCount} {itemCount === 1 ? 'item' : 'items'} •{' '}
        {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(total)}
      </div>
    </Link>
  )
} 