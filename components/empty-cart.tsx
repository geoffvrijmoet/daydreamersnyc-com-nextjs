'use client'

import Link from 'next/link'

export function EmptyCart() {
  return (
    <div className="text-center py-8">
      <p className="text-gray-600 mb-4">Your cart is empty.</p>
      <Link 
        href="/menu"
        className="inline-block px-6 py-3 bg-eggplant text-creamsicle font-quicksand font-bold rounded-lg hover:bg-eggplant/90"
      >
        Back to Menu
      </Link>
    </div>
  )
} 