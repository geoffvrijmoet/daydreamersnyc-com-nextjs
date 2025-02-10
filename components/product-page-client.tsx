'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/lib/cart-context'
import { ProductImagesGrid } from '@/components/product-images-grid'
import { ProductVariants } from '@/components/product-variants'
import { ProductDescriptionTabs } from '@/components/product-description-tabs'
import { CartTotal } from '@/components/cart-total'
import type { Product } from '@/lib/types'

interface ProductPageClientProps {
  product: Product
}

export function ProductPageClient({ product }: ProductPageClientProps) {
  const { items, addItem, removeItem, isLoading } = useCart()
  const images = product.images.edges.map(edge => edge.node)
  const firstVariant = product.variants.edges[0]?.node
  const variants = product.variants.edges.map(edge => edge.node)
  const isIceCream = product.title === "Strawberry Shortcake" || product.title === "Allergy Fighter"
  
  // Initialize selectedVariant
  const [selectedVariant, setSelectedVariant] = useState<typeof firstVariant | null>(firstVariant || null)
  const [selectedPrice, setSelectedPrice] = useState(firstVariant?.price.amount || product.priceRange.minVariantPrice.amount)
  const [selectedCurrency, setSelectedCurrency] = useState(firstVariant?.price.currencyCode || product.priceRange.minVariantPrice.currencyCode)
  
  // Initialize quantity state without reading from cart yet
  const [quantity, setQuantity] = useState(0)

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

  // Keep quantity in sync with cart
  useEffect(() => {
    if (isLoading) {
      console.log('Cart still loading...')
      return
    }

    const productId = isIceCream ? product.id : selectedVariant?.id
    if (!productId) return

    const title = isIceCream 
      ? product.title 
      : `${product.title} - ${selectedVariant?.title || ''}`

    console.log('Checking cart for:', { productId, title, items })

    const cartItem = items.find(item => {
      if (isIceCream) {
        return item.productId === product.id && item.isIceCream
      } else {
        return item.productId === productId && item.title === title
      }
    })
    
    console.log('Found cart item:', cartItem)
    setQuantity(cartItem?.quantity || 0)
  }, [items, isLoading, isIceCream, product.id, product.title, selectedVariant])

  const handleVariantChange = (variantId: string, price: string, currency: string) => {
    const variant = variants.find(v => v.id === variantId)
    if (!variant) return
    
    setSelectedVariant(variant)
    setSelectedPrice(price)
    setSelectedCurrency(currency)
    
    // Check cart quantity for the new variant
    const title = `${product.title} - ${variant.title || ''}`
    const cartItem = items.find(item => 
      item.productId === variant.id && item.title === title
    )
    setQuantity(cartItem?.quantity || 0)
  }

  const handleQuantityChange = (newQuantity: number) => {
    const productId = isIceCream ? product.id : selectedVariant?.id
    if (!productId) return
    
    const title = isIceCream 
      ? product.title 
      : `${product.title} - ${selectedVariant?.title || ''}`
    
    if (newQuantity === 0) {
      removeItem(productId, title)
    } else {
      addItem({
        productId,
        quantity: newQuantity,
        price: parseFloat(selectedPrice),
        title,
        isIceCream,
        bulkDiscount: isIceCream ? undefined : bulkDiscount
      })
    }
  }

  const showBulkDiscount = bulkDiscount && quantity >= bulkDiscount.threshold
  const currentPrice = showBulkDiscount
    ? bulkDiscount.pricePerUnit
    : parseFloat(selectedPrice)

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-quicksand font-bold text-eggplant mb-8 text-center">{product.title}</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <ProductImagesGrid images={images} title={product.title} />
        </div>

        <div>
          <div className="flex items-center justify-center space-x-6 mb-6">
            <div className="text-center">
              <p className="text-xl font-quicksand font-bold text-cutiepie mb-4">
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
              
              <div className="flex items-center justify-center space-x-2">
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
  )
} 