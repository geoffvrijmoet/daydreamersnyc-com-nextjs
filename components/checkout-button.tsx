'use client'

import { useState } from 'react'
import { useCart } from '@/lib/cart-context'

export function CheckoutButton() {
  const { items } = useCart()
  const [isLoading, setIsLoading] = useState(false)

  if (items.length === 0) return null

  const handleCheckout = async () => {
    try {
      setIsLoading(true)

      // Create checkout directly with all items
      const response = await fetch('/api/shopify/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lines: items.map(item => ({
            variantId: item.productId,
            quantity: item.quantity
          }))
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create checkout')
      }

      const { checkoutUrl } = await response.json()
      
      // Redirect to checkout
      window.location.href = checkoutUrl
    } catch (error) {
      console.error('Checkout error:', error)
      alert('There was an error starting checkout. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button 
      className="w-full py-3 bg-eggplant text-creamsicle font-quicksand font-bold rounded-lg hover:bg-eggplant/90 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={handleCheckout}
      disabled={isLoading}
    >
      {isLoading ? 'Preparing Checkout...' : 'Proceed to Checkout'}
    </button>
  )
} 