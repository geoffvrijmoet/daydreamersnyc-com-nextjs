'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { Product } from '@/lib/types'
import { useCart } from '@/lib/cart-context'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { items, addItem, removeItem } = useCart()
  const [quantity, setQuantity] = useState(0)
  const firstImage = product.images.edges[0]?.node
  const price = product.priceRange.minVariantPrice.amount
  const currency = product.priceRange.minVariantPrice.currencyCode
  const isIceCream = product.title.includes("Shortcake") || product.title.includes("Allergy Fighter")

  // Sync with cart quantity on mount and when cart changes
  useEffect(() => {
    const cartItem = items.find(item => item.productId === product.id)
    if (cartItem) {
      setQuantity(cartItem.quantity)
    } else {
      setQuantity(0)
    }
  }, [items, product.id])

  // Calculate if ice cream discount applies
  const totalIceCreamQuantity = items
    .filter(i => i.isIceCream)
    .reduce((total, i) => total + i.quantity, 0)
  const showDiscountPrice = isIceCream && totalIceCreamQuantity >= 2

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity)
    
    if (newQuantity === 0) {
      removeItem(product.id)
    } else {
      addItem({
        productId: product.id,
        quantity: newQuantity,
        price: parseFloat(price),
        title: product.title,
        isIceCream: isIceCream
      })
    }
  }

  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="relative w-24 h-24 flex-shrink-0">
        {!isIceCream && firstImage && (
          <Image
            src={firstImage.url}
            alt={firstImage.altText || product.title}
            fill
            className="object-cover rounded-md"
          />
        )}
      </div>
      
      <div className="flex-grow flex items-center justify-between">
        <div>
          <h3 className="text-lg font-quicksand font-bold text-eggplant">
            {product.title}
          </h3>
          <div className="flex items-center gap-2">
            {showDiscountPrice ? (
              <>
                <p className="text-lg font-quicksand font-bold text-cutiepie/50 line-through">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: currency,
                  }).format(parseFloat(price))}
                </p>
                <p className="text-lg font-quicksand font-bold text-cutiepie">
                  $1.50
                </p>
              </>
            ) : (
              <p className="text-lg font-quicksand font-bold text-cutiepie">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: currency,
                }).format(parseFloat(price))}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={() => handleQuantityChange(Math.max(0, quantity - 1))}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-creamsicle/20 text-eggplant hover:bg-creamsicle/30"
          >
            -
          </button>
          <span className="w-8 text-center font-quicksand">{quantity}</span>
          <button 
            onClick={() => handleQuantityChange(quantity + 1)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-creamsicle/20 text-eggplant hover:bg-creamsicle/30"
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
} 