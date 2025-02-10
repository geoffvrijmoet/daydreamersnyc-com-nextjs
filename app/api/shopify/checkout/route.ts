import { NextResponse } from 'next/server'
import { SHOPIFY_STOREFRONT_ACCESS_TOKEN, SHOPIFY_STORE_DOMAIN } from '@/lib/constants'

interface LineItem {
  merchandiseId: string
  quantity: number
}

interface CustomAttribute {
  key: string
  value: string
}

interface CartInput {
  lineItems: LineItem[]
  customAttributes: CustomAttribute[]
}

const CREATE_CART_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`

export async function POST(request: Request) {
  try {
    const { lineItems, customAttributes } = await request.json() as CartInput

    const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: CREATE_CART_MUTATION,
        variables: {
          input: {
            lines: lineItems.map(item => ({
              merchandiseId: item.merchandiseId,
              quantity: item.quantity
            })),
            attributes: customAttributes,
          },
        },
      }),
    })

    const { data, errors } = await response.json()

    if (errors) {
      console.error('Shopify API errors:', errors)
      return NextResponse.json({ error: errors[0].message }, { status: 400 })
    }

    if (data?.cartCreate?.userErrors?.length > 0) {
      console.error('Cart creation errors:', data.cartCreate.userErrors)
      return NextResponse.json({ error: data.cartCreate.userErrors[0].message }, { status: 400 })
    }

    // Get the checkout URL and ensure it uses the custom domain
    let checkoutUrl = data.cartCreate.cart.checkoutUrl
    
    // Convert the URL to use the custom domain and add checkout=true
    const url = new URL(checkoutUrl)
    url.hostname = 'daydreamersnyc.com'
    url.searchParams.append('checkout', 'true')
    checkoutUrl = url.toString()

    return NextResponse.json({ checkoutUrl })
  } catch (error) {
    console.error('Error creating cart:', error)
    return NextResponse.json({ error: 'Failed to create cart' }, { status: 500 })
  }
} 