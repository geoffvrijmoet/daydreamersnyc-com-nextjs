'use client'

import { useState } from 'react'
import { ProductCard } from '@/components/product-card'
import type { Collection } from '@/lib/types'

interface MenuContentProps {
  menuSections: Collection[]
}

export function MenuContent({ menuSections }: MenuContentProps) {
  const [searchQuery, setSearchQuery] = useState('')
  
  // Filter products based on search query
  const filteredSections = menuSections.map(section => ({
    ...section,
    products: {
      ...section.products,
      edges: section.products.edges.filter(({ node: product }) => 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
  })).filter(section => section.products.edges.length > 0)

  return (
    <>
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm -mx-4 px-4 py-4">
        <input
          type="search"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-full border border-creamsicle/20 focus:border-eggplant focus:outline-none font-quicksand"
        />
      </div>

      <nav className="mb-12 mt-4">
        <div className="flex flex-wrap gap-3 justify-center">
          {filteredSections.map((collection) => (
            <a
              key={collection.id}
              href={`#${collection.title.toLowerCase().replace(/\s+/g, '-')}`}
              className="px-4 py-2 bg-creamsicle/20 text-eggplant rounded-full font-quicksand hover:bg-creamsicle/30 transition-colors"
            >
              {collection.title}
            </a>
          ))}
        </div>
      </nav>
      
      <div className="space-y-12">
        {filteredSections.map((collection) => (
          <section 
            key={collection.id} 
            id={collection.title.toLowerCase().replace(/\s+/g, '-')}
          >
            <h2 className="text-2xl font-quicksand font-bold text-eggplant mb-6">
              {collection.title}
            </h2>
            <div className="space-y-4">
              {collection.products.edges.map(({ node: product }) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  )
} 