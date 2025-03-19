import { NextResponse } from 'next/server'
import { shopifyClient } from '@/lib/shopify'

// Updated cart creation mutation with complete fields as per the latest Storefront Cart API
const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
          totalTaxAmount {
            amount
            currencyCode
          }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    title
                  }
                }
              }
              cost {
                totalAmount {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`

interface CartItem {
  merchandiseId: string
  quantity: number
  attributes?: Array<{
    key: string
    value: string
  }>
}

interface CartRequestBody {
  items: CartItem[]
}

interface CartCreateResponse {
  cartCreate: {
    cart: {
      id: string
      checkoutUrl: string
    }
    userErrors: Array<{
      field: string[]
      message: string
    }>
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as CartRequestBody
    const { items } = body

    console.log('Creating cart with items:', items)

    // Create cart with all items
    const response = await shopifyClient.request<CartCreateResponse>(CART_CREATE_MUTATION, {
      input: {
        lines: items.map(item => ({
          merchandiseId: item.merchandiseId,
          quantity: item.quantity,
          attributes: item.attributes
        })),
        // Include buyer identity if available (optional)
        // buyerIdentity: {
        //   email: customerEmail,
        //   countryCode: customerCountry,
        // }
      }
    })

    console.log('Cart creation response:', response)

    if (response.cartCreate.userErrors.length > 0) {
      console.error('Cart creation errors:', response.cartCreate.userErrors)
      throw new Error(JSON.stringify(response.cartCreate.userErrors))
    }

    // Get the checkout URL from Shopify's response
    const shopifyCheckoutUrl = response.cartCreate.cart.checkoutUrl
    console.log('Shopify checkout URL:', shopifyCheckoutUrl)

    // Ensure it's using the Shopify domain
    const checkoutUrl = shopifyCheckoutUrl.replace('daydreamersnyc.com', 'daydreamers-pet-supply.myshopify.com')
    console.log('Final checkout URL:', checkoutUrl)

    return NextResponse.json({
      checkoutUrl,
      cart: response.cartCreate.cart
    })
  } catch (error) {
    console.error('Error creating cart:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create cart' },
      { status: 500 }
    )
  }
} 