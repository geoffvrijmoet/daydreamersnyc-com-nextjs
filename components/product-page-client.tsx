'use client'

import { useState, useEffect } from 'react'
import { CartProvider, useCart } from '@/lib/cart-context'
import { ProductImagesGrid } from '@/components/product-images-grid'
import { ProductVariants } from '@/components/product-variants'
import { ProductDescriptionTabs } from '@/components/product-description-tabs'
import { CartTotal } from '@/components/cart-total'
import type { Product } from '@/lib/types'

interface ProductPageClientProps {
  product: Product
}

export function ProductPageClient({ product }: ProductPageClientProps) {
  const { items, addItem, removeItem } = useCart()
  const images = product.images.edges.map(edge => edge.node)
  const firstVariant = product.variants.edges[0]?.node
  
  const [selectedPrice, setSelectedPrice] = useState(firstVariant?.price.amount || product.priceRange.minVariantPrice.amount)
  const [selectedCurrency, setSelectedCurrency] = useState(firstVariant?.price.currencyCode || product.priceRange.minVariantPrice.currencyCode)
  const [quantity, setQuantity] = useState(1)

  // Sync with cart quantity on mount and when cart changes
  useEffect(() => {
    const cartItem = items.find(item => item.productId === product.id)
    if (cartItem) {
      setQuantity(cartItem.quantity)
    } else {
      setQuantity(0)
    }
  }, [items, product.id])

  const handleVariantChange = (variantId: string, price: string, currency: string) => {
    setSelectedPrice(price)
    setSelectedCurrency(currency)
  }

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity)
    
    if (newQuantity === 0) {
      removeItem(product.id)
    } else {
      addItem({
        productId: product.id,
        quantity: newQuantity,
        price: parseFloat(selectedPrice),
        title: product.title,
        isIceCream: false,
        bulkDiscount: bulkDiscount
      })
    }
  }

  // Calculate total price
  const variants = product.variants.edges.map(edge => edge.node)
  const isIceCream = product.title === "Strawberry Shortcake" || product.title === "Allergy Fighter"
  
  // Calculate bulk discount if applicable
  const bulkDiscount = (() => {
    if (isIceCream || variants.length !== 2) return undefined
    const singleVariant = variants.find(v => v.title === "Single")
    const bagVariant = variants.find(v => v.title.startsWith("Bag of "))
    
    if (!singleVariant || !bagVariant) return undefined
    
    const match = bagVariant.title.match(/Bag of (\d+)/)
    if (!match) return undefined
    
    const threshold = parseInt(match[1])
    const bagPrice = parseFloat(bagVariant.price.amount)
    const pricePerUnit = bagPrice / threshold

    return {
      threshold,
      pricePerUnit
    }
  })()

  const showBulkDiscount = bulkDiscount && quantity >= bulkDiscount.threshold
  const currentPrice = showBulkDiscount
    ? bulkDiscount.pricePerUnit
    : parseFloat(selectedPrice)

  return (
    <CartProvider>
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-quicksand font-bold text-eggplant mb-8 text-center">{product.title}</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <ProductImagesGrid images={images} title={product.title} />
          </div>

          <div>
            <div className="flex items-center justify-center space-x-6 mb-6">
              <button
                onClick={() => handleQuantityChange(Math.max(0, quantity - 1))}
                className="w-10 h-10 rounded-full bg-eggplant text-white flex items-center justify-center text-xl font-bold hover:bg-eggplant/90 transition-colors"
              >
                -
              </button>
              
              <div className="text-center">
                <p className="text-xl font-quicksand font-bold text-cutiepie">
                  {showBulkDiscount && (
                    <span className="line-through text-cutiepie/50 block">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: selectedCurrency,
                      }).format(parseFloat(selectedPrice))} each
                    </span>
                  )}
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: selectedCurrency,
                  }).format(currentPrice)} each
                </p>
              </div>

              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="w-10 h-10 rounded-full bg-eggplant text-white flex items-center justify-center text-xl font-bold hover:bg-eggplant/90 transition-colors"
              >
                +
              </button>
            </div>

            <ProductVariants 
              product={product} 
              onVariantChange={handleVariantChange} 
            />

            <div className="bg-white rounded-lg p-6 mt-6">
              <ProductDescriptionTabs description={product.description} />
            </div>
          </div>
        </div>
        <CartTotal />
      </div>
    </CartProvider>
  )
} 