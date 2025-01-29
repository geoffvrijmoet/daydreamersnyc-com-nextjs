'use client'

import { useState, useEffect } from 'react'
import type { Product } from '@/lib/types'

interface ProductVariantsProps {
  product: Product
  onVariantChange: (variantId: string, price: string, currency: string) => void
}

export function ProductVariants({ product, onVariantChange }: ProductVariantsProps) {
  const variants = product.variants.edges.map(edge => edge.node)
  const isIceCream = product.title === "Strawberry Shortcake" || product.title === "Allergy Fighter"
  const isVivaRaw = product.title.includes("Viva Raw")

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0)
  const [selectedAnimalType, setSelectedAnimalType] = useState(() => {
    if (!isVivaRaw) return ''
    const firstVariant = variants[0]
    if (!firstVariant) return ''
    const parts = firstVariant.title.split('/')
    return parts.length === 2 ? parts[0].trim() : ''
  })

  const [selectedProteinType, setSelectedProteinType] = useState(() => {
    if (!isVivaRaw) return ''
    const firstVariant = variants[0]
    if (!firstVariant) return ''
    const parts = firstVariant.title.split('/')
    return parts.length === 2 ? parts[1].trim() : ''
  })

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

  // Update parent component when variant changes
  useEffect(() => {
    if (selectedVariant) {
      onVariantChange(
        selectedVariant.id,
        selectedVariant.price.amount,
        selectedVariant.price.currencyCode
      )
    }
  }, [selectedVariant, onVariantChange])

  if (isIceCream) return null

  return (
    <div className="space-y-6 bg-white rounded-lg p-6 mb-6">
      {isVivaRaw && vivaRawOptions && (
        <>
          <div className="space-y-2">
            <p className="text-sm font-quicksand text-eggplant">Type:</p>
            <div className="flex flex-wrap gap-2">
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
            <div className="flex flex-wrap gap-2">
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
        </>
      )}
      
      {!isVivaRaw && displayVariants.length > 1 && (
        <div>
          <p className="text-sm font-quicksand text-eggplant mb-2">Options:</p>
          <div className="flex flex-wrap gap-2">
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
    </div>
  )
} 