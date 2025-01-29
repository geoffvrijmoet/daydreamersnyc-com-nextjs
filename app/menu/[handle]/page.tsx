import { notFound } from 'next/navigation'
import { shopifyClient } from '@/lib/shopify'
import { PRODUCT_QUERY } from '@/lib/queries'
import { ShopifyProductResponse } from '@/lib/types'
import { ProductPageClient } from '@/components/product-page-client'

interface Props {
  params: { handle: string }
}

async function getProduct(handle: string) {
  try {
    const data = await shopifyClient.request<ShopifyProductResponse>(PRODUCT_QUERY, { handle })
    return data.product
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export default async function MenuItemPage({ params }: Props) {
  const product = await getProduct(params.handle)

  if (!product) {
    notFound()
  }

  return <ProductPageClient product={product} />
}

export async function generateMetadata({ params }: { params: { handle: string } }) {
  return {
    alternates: {
      canonical: `https://daydreamersnyc.com/menu/${params.handle}`,
    },
  }
} 