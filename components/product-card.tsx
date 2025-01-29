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
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0)
  const [quantity, setQuantity] = useState(0)
  const firstImage = product.images.edges[0]?.node
  const variants = product.variants.edges.map(edge => edge.node)
  const isIceCream = product.title === "Strawberry Shortcake" || product.title === "Allergy Fighter"
  const isVivaRaw = product.title.includes("Viva Raw")

  // Log Viva Raw variants
  if (isVivaRaw) {
    console.log('Viva Raw Product:', product.title)
    console.log('All Variants:', variants.map(v => ({
      id: v.id,
      title: v.title,
      price: v.price
    })))
  }

  // Special handling for Viva Raw variants
  const vivaRawOptions = (() => {
    if (!isVivaRaw) return null

    const animalTypes = new Set<string>()
    const proteinTypes = new Set<string>()
    const variantMap = new Map<string, string>() // Map to store exact variant titles
    const typeToRecipes = new Map<string, Set<string>>() // Map to store valid recipes for each type
    
    variants.forEach(variant => {
      const parts = variant.title.split('/')
      if (parts.length === 2) {
        const type = parts[0].trim()
        const recipe = parts[1].trim()
        animalTypes.add(type)
        proteinTypes.add(recipe)
        variantMap.set(`${type}/${recipe}`, variant.title)
        
        // Track which recipes are valid for each type
        if (!typeToRecipes.has(type)) {
          typeToRecipes.set(type, new Set())
        }
        typeToRecipes.get(type)?.add(recipe)
      }
    })

    return {
      animalTypes: Array.from(animalTypes),
      proteinTypes: Array.from(proteinTypes),
      variantMap,
      typeToRecipes
    }
  })()

  const [selectedAnimalType, setSelectedAnimalType] = useState(vivaRawOptions?.animalTypes[0] || '')
  const [selectedProteinType, setSelectedProteinType] = useState(() => {
    // Initialize with a valid recipe for the initial type
    const validRecipes = vivaRawOptions?.typeToRecipes.get(vivaRawOptions?.animalTypes[0] || '')
    return validRecipes?.values().next().value || ''
  })

  // Handle type selection change
  const handleTypeChange = (newType: string) => {
    setSelectedAnimalType(newType)
    
    // Check if current recipe is valid for new type
    const validRecipes = vivaRawOptions?.typeToRecipes.get(newType)
    if (!validRecipes?.has(selectedProteinType)) {
      // If current recipe is invalid, select the first valid recipe for the new type
      const firstValidRecipe = validRecipes?.values().next().value
      if (firstValidRecipe) {
        setSelectedProteinType(firstValidRecipe)
      }
    }
  }

  // Check if a recipe is valid for the current type
  const isRecipeValidForType = (recipe: string) => {
    return vivaRawOptions?.typeToRecipes.get(selectedAnimalType)?.has(recipe) || false
  }

  // Handle variant display logic
  const displayVariants = variants.filter((variant) => {
    if (isVivaRaw) return true // Don't filter Viva Raw variants
    
    // If we have a "Single" and "Bag of X" pair, only show the Single variant
    if (variants.length === 2 && variants.some(v => v.title === "Single") && variants.some(v => v.title.startsWith("Bag of "))) {
      return variant.title === "Single"
    }

    // Show all variants for oz bag products or products without Single/Bag of pattern
    return true
  })

  // For Viva Raw, find the selected variant based on animal and protein type
  const selectedVariant = isVivaRaw
    ? variants.find(v => {
        // Get the exact variant title from our map
        const exactTitle = vivaRawOptions?.variantMap.get(`${selectedAnimalType}/${selectedProteinType}`)
        return v.title === exactTitle
      }) || variants[0]
    : displayVariants[selectedVariantIndex]

  // Log selected variant for debugging
  if (isVivaRaw) {
    console.log('Selected Type:', selectedAnimalType)
    console.log('Selected Recipe:', selectedProteinType)
    console.log('Selected Variant:', selectedVariant)
  }

  const price = isIceCream ? product.priceRange.minVariantPrice.amount : selectedVariant?.price.amount
  const currency = isIceCream ? product.priceRange.minVariantPrice.currencyCode : selectedVariant?.price.currencyCode

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

  // Sync with cart quantity on mount and when cart changes
  useEffect(() => {
    const productId = isIceCream ? product.id : selectedVariant?.id
    const cartItem = items.find(item => item.productId === productId)
    if (cartItem) {
      setQuantity(cartItem.quantity)
    } else {
      setQuantity(0)
    }
  }, [items, isIceCream, product.id, selectedVariant?.id])

  // Calculate if ice cream discount applies
  const totalIceCreamQuantity = items
    .filter(i => i.isIceCream)
    .reduce((total, i) => total + i.quantity, 0)
  const showIceCreamDiscount = isIceCream && totalIceCreamQuantity >= 2

  // Calculate if bulk discount applies
  const showBulkDiscount = bulkDiscount && quantity >= bulkDiscount.threshold

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity)
    
    if (newQuantity === 0) {
      removeItem(isIceCream ? product.id : selectedVariant.id)
    } else {
      addItem({
        productId: isIceCream ? product.id : selectedVariant.id,
        quantity: newQuantity,
        price: parseFloat(price),
        title: isIceCream 
          ? product.title 
          : isVivaRaw
            ? `${product.title} - ${selectedAnimalType} / ${selectedProteinType}`
            : `${product.title} - ${selectedVariant.title}`,
        isIceCream,
        bulkDiscount: isIceCream ? undefined : bulkDiscount
      })
    }
  }

  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
      {!isIceCream && firstImage && (
        <Link href={`/menu/${product.handle}`} className="relative w-24 h-24 flex-shrink-0">
          <Image
            src={firstImage.url}
            alt={firstImage.altText || product.title}
            fill
            className="object-cover rounded-md hover:opacity-80 transition-opacity"
          />
        </Link>
      )}
      
      <div className="flex-grow">
        <div>
          <Link href={`/menu/${product.handle}`}>
            <h3 className="text-lg font-quicksand font-bold text-eggplant hover:text-eggplant/80 transition-colors">
              {product.title}
            </h3>
          </Link>
          
          {isIceCream && product.description && (
            <p className="text-sm text-gray-600 mt-1">{product.description}</p>
          )}
          
          {isVivaRaw && vivaRawOptions && (
            <div className="space-y-3 mt-2">
              <div className="space-y-2">
                <p className="text-sm font-quicksand text-eggplant">Type:</p>
                <div className="flex gap-2">
                  {vivaRawOptions.animalTypes.map((animalType) => (
                    <button
                      key={animalType}
                      onClick={() => handleTypeChange(animalType)}
                      className={`px-3 py-1 rounded-full text-sm font-quicksand ${
                        selectedAnimalType === animalType
                          ? 'bg-eggplant text-creamsicle'
                          : 'bg-creamsicle/20 text-eggplant hover:bg-creamsicle/30'
                      }`}
                    >
                      {animalType}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-quicksand text-eggplant">Recipe:</p>
                <div className="flex gap-2">
                  {vivaRawOptions.proteinTypes.map((proteinType) => {
                    const isValid = isRecipeValidForType(proteinType)
                    return (
                      <button
                        key={proteinType}
                        onClick={() => isValid && setSelectedProteinType(proteinType)}
                        disabled={!isValid}
                        className={`px-3 py-1 rounded-full text-sm font-quicksand ${
                          selectedProteinType === proteinType
                            ? 'bg-eggplant text-creamsicle'
                            : isValid
                              ? 'bg-creamsicle/20 text-eggplant hover:bg-creamsicle/30'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {proteinType}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
          
          {!isIceCream && !isVivaRaw && displayVariants.length > 1 && (
            <div className="space-y-3">
              <div className="flex gap-2">
                {displayVariants.map((variant, index) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariantIndex(index)}
                    className={`px-3 py-1 rounded-full text-sm font-quicksand ${
                      selectedVariantIndex === index
                        ? 'bg-eggplant text-creamsicle'
                        : 'bg-creamsicle/20 text-eggplant hover:bg-creamsicle/30'
                    }`}
                  >
                    {variant.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 mt-2">
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

            <div className="flex items-center gap-2">
              {(showIceCreamDiscount || showBulkDiscount) && (
                <p className="text-lg font-quicksand font-bold text-cutiepie/50 line-through">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: currency,
                  }).format(parseFloat(price))}
                </p>
              )}
              <p className="text-lg font-quicksand font-bold text-cutiepie">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: currency,
                }).format(
                  showIceCreamDiscount 
                    ? 1.50 
                    : showBulkDiscount 
                      ? bulkDiscount.pricePerUnit
                      : parseFloat(price)
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 