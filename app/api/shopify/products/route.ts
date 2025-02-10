import { NextResponse } from 'next/server'

interface ShopifyProduct {
  id: string
  title: string
  handle: string
  variants: Array<{
    price: string
  }>
}

const SHOP_NAME = process.env.SHOPIFY_SHOP_NAME
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN

export async function GET() {
  try {
    if (!SHOP_NAME || !ACCESS_TOKEN) {
      throw new Error('Missing Shopify credentials')
    }

    const response = await fetch(
      `https://${SHOP_NAME}.myshopify.com/admin/api/2024-01/products.json?status=active`,
      {
        headers: {
          'X-Shopify-Access-Token': ACCESS_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch products from Shopify')
    }

    const data = await response.json()

    // Transform the data to match our interface
    const products = data.products.map((product: ShopifyProduct) => ({
      id: product.id,
      title: product.title,
      price: product.variants[0]?.price || '0.00',
      handle: product.handle,
    }))

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error fetching Shopify products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
} 