import Image from 'next/image'
import { notFound } from 'next/navigation'
import { shopifyClient } from '@/lib/shopify'
import { PRODUCT_QUERY } from '@/lib/queries'
import { ShopifyProductResponse } from '@/lib/types'

async function getProduct(handle: string) {
  try {
    const data = await shopifyClient.request<ShopifyProductResponse>(PRODUCT_QUERY, { handle })
    return data.product
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export default async function MenuItemPage({
  params,
}: {
  params: { handle: string }
}) {
  const product = await getProduct(params.handle)

  if (!product) {
    notFound()
  }

  const firstImage = product.images.edges[0]?.node
  const price = product.priceRange.minVariantPrice.amount
  const currency = product.priceRange.minVariantPrice.currencyCode

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative aspect-square rounded-lg overflow-hidden">
          {firstImage && (
            <Image
              src={firstImage.url}
              alt={firstImage.altText || product.title}
              fill
              className="object-cover"
              priority
            />
          )}
        </div>

        <div>
          <h1 className="text-3xl font-quicksand font-bold text-eggplant mb-4">{product.title}</h1>
          <p className="text-xl font-quicksand font-bold text-cutiepie mb-4">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: currency,
            }).format(parseFloat(price))}
          </p>
          <div className="prose max-w-none mb-8">
            <p>{product.description}</p>
          </div>
          
          <button
            className="w-full bg-eggplant text-creamsicle font-quicksand font-bold py-3 px-6 rounded-lg hover:bg-eggplant/90 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: { params: { handle: string } }) {
  return {
    alternates: {
      canonical: `https://daydreamersnyc.com/menu/${params.handle}`,
    },
  }
} 