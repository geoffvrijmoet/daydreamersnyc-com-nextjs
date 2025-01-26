import { shopifyClient } from '@/lib/shopify'
import { COLLECTIONS_WITH_PRODUCTS_QUERY } from '@/lib/queries'
import { ProductCard } from '@/components/product-card'
import type { CollectionsResponse, Collection } from '@/lib/types'
import { CartProvider } from '@/lib/cart-context'
import { CartTotal } from '@/components/cart-total'

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
        .flatMap(({ node: product }) => {
          // If this is the ice cream product, create a card for each variant
          if (product.title === "Organic Doggy Ice Cream") {
            return product.variants.edges.map(({ node: variant }) => ({
              ...product,
              id: variant.id,
              title: variant.title,
              priceRange: {
                minVariantPrice: variant.price
              },
              images: {
                edges: [{
                  node: {
                    url: variant.image?.url || product.images.edges[0]?.node.url,
                    altText: variant.image?.altText || product.images.edges[0]?.node.altText
                  }
                }]
              }
            }))
          }
          // Otherwise return the product as is
          return [product]
        })

      return {
        ...collection,
        products: {
          edges: uniqueProducts.map(product => ({ node: product }))
        }
      }
    })
    // Finally, remove any collections that are empty
    .filter(collection => collection.products.edges.length > 0)

  return (
    <CartProvider>
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-quicksand font-bold text-eggplant mb-8">Our Menu</h1>
        
        <div className="space-y-12">
          {menuSections.map((collection) => (
            <section key={collection.id}>
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
      </div>
      <CartTotal />
    </CartProvider>
  )
}

export const metadata = {
  title: 'Menu | Daydreamers Doggy Ice Cream',
  description: 'Browse our delicious selection of dog-friendly ice cream treats',
  alternates: {
    canonical: 'https://daydreamersnyc.com/menu',
  },
} 