import { shopifyClient } from '@/lib/shopify'
import { COLLECTIONS_WITH_PRODUCTS_QUERY } from '@/lib/queries'
import type { CollectionsResponse, Collection } from '@/lib/types'
import { CartTotal } from '@/components/cart-total'
import { MenuContent } from '@/components/menu-content'

// Define the order of collections - this determines priority
const MENU_SECTION_ORDER = {
  'Ice Cream': 1,
  'Treats & Chews': 2,
  'Food': 3,
  'Supplements': 4,
  'Toys': 5,
} as const

type MenuSection = keyof typeof MENU_SECTION_ORDER

async function getCollections(): Promise<Collection[]> {
  try {
    const data = await shopifyClient.request<CollectionsResponse>(COLLECTIONS_WITH_PRODUCTS_QUERY)
    return data.collections.edges.map(edge => edge.node)
  } catch (error) {
    console.error('Error fetching collections:', error)
    return []
  }
}

export default async function MenuPage() {
  const collections = await getCollections()
  
  // First, sort collections by priority
  const sortedCollections = collections
    .filter(collection => 
      // Only include collections that are in our menu order
      collection.title in MENU_SECTION_ORDER
    )
    .sort((a, b) => 
      MENU_SECTION_ORDER[a.title as MenuSection] - 
      MENU_SECTION_ORDER[b.title as MenuSection]
    )

  // Keep track of products we've already displayed
  const displayedProductIds = new Set<string>()

  // Then process collections in order, removing duplicates
  const menuSections = sortedCollections
    .map(collection => {
      // Filter products that haven't been shown yet
      const uniqueProducts = collection.products.edges
        .filter(({ node: product }) => {
          if (!displayedProductIds.has(product.id)) {
            displayedProductIds.add(product.id)
            return true
          }
          return false
        })
        .map(({ node: product }) => {
          // If this is the ice cream product with variants, create separate products
          if (product.title === "Organic Doggy Ice Cream") {
            const variants = product.variants.edges.map(edge => edge.node)
            return variants.map(variant => ({
              node: {
                ...product,
                id: variant.id, // Use variant ID as product ID
                title: variant.title, // Use variant title as product title
                isIceCream: true,
                priceRange: {
                  minVariantPrice: variant.price
                }
              }
            }))
          }
          return { node: product }
        })
        .flat() // Flatten the array since ice cream variants create nested arrays

      return {
        ...collection,
        products: {
          ...collection.products,
          edges: uniqueProducts
        }
      }
    })
    // Finally, remove any collections that are empty
    .filter(collection => collection.products.edges.length > 0)

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <MenuContent menuSections={menuSections} />
      <CartTotal />
    </div>
  )
}

export const metadata = {
  title: 'Menu | Daydreamers Doggy Ice Cream',
  description: 'Browse our delicious selection of dog-friendly ice cream treats',
  alternates: {
    canonical: 'https://daydreamersnyc.com/menu',
  },
} 