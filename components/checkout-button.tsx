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

      // Check if any items are Puppy Palentines variants
      const puppyPalentinesVariants = [
        '49936312140059', // $20
        '49936312172827', // $25
        '49936312205595', // $30
        '49936312238363', // $35
        '49936312271131', // $40
        '49936312303899', // $45
        '49936312336667'  // $50
      ]

      const hasPuppyPalentinesItem = items.some(item => 
        puppyPalentinesVariants.includes(item.productId)
      )

      if (hasPuppyPalentinesItem) {
        // For Puppy Palentines, create a draft order with all items
        const response = await fetch('/api/shopify/draft-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bagPrice: Number(items.find(item => 
              puppyPalentinesVariants.includes(item.productId)
            )?.price || 20),
            dogName: 'TBD', // Will be filled in form
            note: 'TBD',    // Will be filled in form
            deliveryInfo: 'TBD', // Will be filled in form
            bonusItems: items
              .filter(item => !puppyPalentinesVariants.includes(item.productId))
              .map(item => ({
                variantId: item.productId,
                quantity: item.quantity,
                title: item.title,
                price: Number(item.price)
              }))
          })
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || 'Failed to create draft order')
        }

        await response.json() // Just check the response is valid
        window.location.href = '/puppy-palentines'
        return
      }

      // Regular checkout flow for non-Puppy Palentines items
      const response = await fetch('/api/shopify/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lines: items.map(item => ({
            variantId: item.productId,
            quantity: item.quantity
          })),
          // Check URL for no-shipping parameter
          requiresShipping: !window.location.search.includes('no-shipping=true')
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