'use client'

import { CartItems } from './cart-items'
import { ResetCartButton } from './reset-cart-button'
import { CheckoutButton } from './checkout-button'

export function CartUI() {
  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-quicksand font-bold text-eggplant">Your Cart</h1>
        <ResetCartButton />
      </div>
      
      <CartItems />

      <div className="mt-8 space-y-4">
        <CheckoutButton />
      </div>
    </div>
  )
} 