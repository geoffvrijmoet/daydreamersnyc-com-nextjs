import { SHOPIFY_STOREFRONT_ACCESS_TOKEN, NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN } from './constants'

const domain = `https://${NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}`
const endpoint = `${domain}/api/2024-01/graphql.json`

interface ShopifyResponse<T> {
  data: T
  errors?: Array<{
    message: string
  }>
}

export interface CartResponse {
  cartCreate: {
    cart: {
      id: string
      checkoutUrl: string
      cost: {
        totalAmount: {
          amount: string
          currencyCode: string
        }
        totalTaxAmount: {
          amount: string
          currencyCode: string
        }
      }
      lines: {
        edges: Array<{
          node: {
            id: string
            quantity: number
            cost: {
              totalAmount: {
                amount: string
                currencyCode: string
              }
            }
            merchandise: {
              __typename: string
              id: string
              title: string
              product: {
                title: string
                handle: string
                featuredImage: {
                  url: string
                  altText: string | null
                }
              }
            }
          }
        }>
      }
    }
    userErrors: Array<{
      field: string[]
      message: string
    }>
  }
}

export interface CheckoutResponse {
  checkoutCreate: {
    checkout: {
      id: string
      webUrl: string
    }
    checkoutUserErrors: Array<{
      code: string
      field: string[]
      message: string
    }>
  }
}

type Variables = Record<string, unknown>

export const shopifyClient = {
  async request<T>(query: string, variables?: Variables): Promise<T> {
    try {
      console.log('Making Shopify request to:', endpoint)
      console.log('With access token:', SHOPIFY_STOREFRONT_ACCESS_TOKEN ? 'Present' : 'Missing')
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
          'Accept': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Shopify API error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        })
        throw new Error(`Shopify API error: ${response.status} ${response.statusText}`)
      }

      const { data, errors } = (await response.json()) as ShopifyResponse<T>

      if (errors) {
        console.error('GraphQL errors:', errors)
        throw new Error(JSON.stringify(errors))
      }

      return data
    } catch (error) {
      console.error('Shopify request failed:', error)
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch from Shopify')
    }
  }
}

export const createCart = `
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

export const createCheckout = `
  mutation checkoutCreate($input: CheckoutCreateInput!) {
    checkoutCreate(input: $input) {
      checkout {
        id
        webUrl
      }
      checkoutUserErrors {
        code
        field
        message
      }
    }
  }
`