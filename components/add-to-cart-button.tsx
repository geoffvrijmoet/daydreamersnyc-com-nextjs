'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/lib/cart-context'
import type { Product } from '@/lib/types'

interface AddToCartButtonProps {
  product: Product
  selectedVariantId?: string
  onQuantityChange?: (quantity: number) => void
  initialQuantity?: number
  currentPrice?: number
}

export function AddToCartButton({ 
  product, 
  selectedVariantId,
  onQuantityChange,
  initialQuantity = 1,
  currentPrice
}: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(initialQuantity)
  const isIceCream = product.title === "Strawberry Shortcake" || product.title === "Allergy Fighter"
  const variants = product.variants.edges.map(edge => edge.node)

  // Find the selected variant
  const selectedVariant = selectedVariantId 
    ? variants.find(v => v.id === selectedVariantId)
    : variants[0]

  // Update quantity when initialQuantity changes
  useEffect(() => {
    setQuantity(initialQuantity)
  }, [initialQuantity])

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity)
    onQuantityChange?.(newQuantity)
  }

  const handleAddToCart = () => {
    addItem({
      productId: isIceCream ? product.id : (selectedVariant?.id || product.id),
      quantity,
      price: currentPrice || parseFloat(selectedVariant?.price.amount || product.priceRange.minVariantPrice.amount),
      title: isIceCream 
        ? product.title 
        : selectedVariant
          ? `${product.title} - ${selectedVariant.title}`
          : product.title,
      isIceCream
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-4 bg-white rounded-lg p-4">
        <button 
          onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-creamsicle/20 text-eggplant hover:bg-creamsicle/30 transition-colors"
        >
          -
        </button>
        <span className="w-12 text-center font-quicksand text-lg">{quantity}</span>
        <button 
          onClick={() => handleQuantityChange(quantity + 1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-creamsicle/20 text-eggplant hover:bg-creamsicle/30 transition-colors"
        >
          +
        </button>
      </div>

      <button
        onClick={handleAddToCart}
        className="w-full bg-eggplant text-creamsicle font-quicksand font-bold py-4 px-6 rounded-lg hover:bg-eggplant/90 transition-colors"
      >
        Add to Cart
      </button>
    </div>
  )
} 