import { SHOPIFY_STOREFRONT_ACCESS_TOKEN, SHOPIFY_STORE_DOMAIN } from './constants'

const domain = `https://${SHOPIFY_STORE_DOMAIN}`
const endpoint = `${domain}/api/2024-01/graphql.json`

interface ShopifyResponse<T> {
  data: T
  errors?: Array<{
    message: string
  }>
}

interface CartResponse {
  cart: {
    checkoutUrl: string
  }
}

type Variables = Record<string, unknown>

export const shopifyClient = {
  async request<T>(query: string, variables?: Variables): Promise<T> {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
        },
        body: JSON.stringify({ query, variables }),
      })

      const { data, errors } = (await response.json()) as ShopifyResponse<T>

      if (errors) {
        throw new Error(JSON.stringify(errors))
      }

      return data
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch from Shopify')
    }
  }
}

export const getCheckoutUrl = async (cartId: string) => {
  const getCheckoutUrlQuery = `
    query checkoutURL($cartId: ID!) {
      cart(id: $cartId) {
        checkoutUrl
      }
    }
  `

  try {
    const response = await shopifyClient.request<CartResponse>(getCheckoutUrlQuery, {
      cartId: cartId,
    })

    return response.cart.checkoutUrl
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to get checkout URL')
  }
}