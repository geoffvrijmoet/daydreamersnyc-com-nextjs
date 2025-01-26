'use client'

import { useState } from 'react'
import { useCart } from '@/lib/cart-context'
import { shopifyClient } from '@/lib/shopify'
import { CART_CREATE_MUTATION, CART_ADD_LINES_MUTATION } from '@/lib/queries'
import type { CartCreateResponse, CartLinesAddResponse } from '@/lib/types'

export function CheckoutButton() {
  const { items } = useCart()
  const [isLoading, setIsLoading] = useState(false)

  if (items.length === 0) return null

  const handleCheckout = async () => {
    try {
      setIsLoading(true)

      // 1. Create a new cart
      const { cartCreate } = await shopifyClient.request<CartCreateResponse>(CART_CREATE_MUTATION)
      
      if (cartCreate.userErrors.length > 0) {
        throw new Error(cartCreate.userErrors[0].message)
      }

      const cartId = cartCreate.cart.id

      // 2. Add items to cart
      const lines = items.map(item => ({
        merchandiseId: item.productId,
        quantity: item.quantity
      }))

      const { cartLinesAdd } = await shopifyClient.request<CartLinesAddResponse>(
        CART_ADD_LINES_MUTATION,
        {
          cartId,
          lines
        }
      )

      if (cartLinesAdd.userErrors.length > 0) {
        throw new Error(cartLinesAdd.userErrors[0].message)
      }

      // 3. Redirect to checkout
      window.location.href = cartLinesAdd.cart.checkoutUrl
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