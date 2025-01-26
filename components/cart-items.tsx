'use client'

import { useCart } from '@/lib/cart-context'
import type { CartItem } from '@/lib/cart-context'
import { EmptyCart } from './empty-cart'

export function CartItems() {
  const { items, addItem, removeItem, total } = useCart()
  const totalIceCreamQuantity = items
    .filter(i => i.isIceCream)
    .reduce((total, i) => total + i.quantity, 0)

  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(item.productId)
    } else {
      addItem({
        ...item,
        quantity: newQuantity
      })
    }
  }

  if (items.length === 0) {
    return <EmptyCart />
  }

  return (
    <>
      <div className="space-y-4 mb-8">
        {items.map((item) => {
          const showDiscountPrice = item.isIceCream && totalIceCreamQuantity >= 2
          const itemPrice = showDiscountPrice ? 1.50 : item.price
          
          return (
            <div key={item.productId} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
              <div>
                <h3 className="font-quicksand font-bold text-eggplant">{item.title}</h3>
                <div className="flex items-center gap-2">
                  {showDiscountPrice && (
                    <p className="text-sm font-quicksand text-cutiepie/50 line-through">
                      ${item.price.toFixed(2)}
                    </p>
                  )}
                  <p className="text-sm font-quicksand text-cutiepie">
                    ${itemPrice.toFixed(2)} each
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleQuantityChange(item, Math.max(0, item.quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-creamsicle/20 text-eggplant hover:bg-creamsicle/30"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-quicksand">{item.quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(item, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-creamsicle/20 text-eggplant hover:bg-creamsicle/30"
                  >
                    +
                  </button>
                </div>

                <p className="font-quicksand font-bold text-eggplant min-w-[80px] text-right">
                  ${(itemPrice * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex justify-between items-center py-4 border-t border-gray-200">
        <p className="font-quicksand font-bold text-eggplant text-xl">Total</p>
        <p className="font-quicksand font-bold text-eggplant text-xl">
          ${total.toFixed(2)}
        </p>
      </div>
    </>
  )
} 