'use client'

import { CartProvider as Provider } from '@/lib/cart-context'
import { CartUI } from './cart-ui'

export function CartProvider() {
  return (
    <Provider>
      <CartUI />
    </Provider>
  )
} 