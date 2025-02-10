import { SHOPIFY_STOREFRONT_ACCESS_TOKEN, SHOPIFY_STORE_DOMAIN } from './constants'

const domain = `https://${SHOPIFY_STORE_DOMAIN}`
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

export const createCart = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        cost {
          totalAmount {
            amount
            currencyCode
          }
          totalTaxAmount {
            amount
            currencyCode
          }
        }
        lines {
          edges {
            node {
              id
              quantity
              cost {
                totalAmount {
                  amount
                  currencyCode
                }
              }
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    title
                    handle
                    featuredImage {
                      url
                      altText
                    }
                  }
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