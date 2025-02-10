import { NextResponse } from 'next/server'

const STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN?.replace(/^https?:\/\//, '').replace(/\/$/, '')
const ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN

interface BonusItem {
  variantId: string
  quantity: number
}

interface DraftOrderRequestBody {
  bagPrice: number
  dogName: string
  note: string
  deliveryInfo: string
  bonusItems: BonusItem[]
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function sendInvoiceWithRetry(
  draftOrderId: string, 
  dogName: string, 
  maxRetries = 3,
  initialDelay = 1000
): Promise<{ invoice_url: string }> {
  let lastError
  let attempt = 0

  while (attempt < maxRetries) {
    try {
      // Wait before attempting to send invoice
      await sleep(initialDelay * Math.pow(2, attempt))

      // Ensure ADMIN_ACCESS_TOKEN is available
      if (!ADMIN_ACCESS_TOKEN) {
        throw new Error('Missing Shopify admin access token')
      }

      const invoiceResponse = await fetch(
        `https://${STORE_DOMAIN}/admin/api/2024-01/draft_orders/${draftOrderId}/send_invoice.json`,
        {
          method: 'POST',
          headers: new Headers({
            'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN,
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            draft_order_invoice: {
              to: "orders@daydreamersnyc.com",
              subject: `Puppy Palentines Order for ${dogName}`,
              custom_message: `New Puppy Palentines order received for ${dogName}!`
            }
          })
        }
      )

      if (!invoiceResponse.ok) {
        const error = await invoiceResponse.json()
        console.error('Invoice API error response:', error)
        throw new Error(JSON.stringify(error))
      }

      const invoiceData = await invoiceResponse.json()
      console.log('Invoice response:', invoiceData)
      
      if (!invoiceData?.draft_order_invoice?.invoice_url) {
        throw new Error('No invoice URL in response')
      }
      
      return invoiceData.draft_order_invoice
    } catch (error) {
      console.error(`Invoice attempt ${attempt + 1} failed:`, error)
      lastError = error
      attempt++
      
      // If this was our last attempt, throw the error
      if (attempt === maxRetries) {
        throw new Error(`Failed to send invoice after ${maxRetries} attempts: ${lastError}`)
      }
    }
  }

  throw lastError
}

export async function POST(request: Request) {
  try {
    if (!STORE_DOMAIN || !ADMIN_ACCESS_TOKEN) {
      throw new Error('Missing Shopify credentials')
    }

    console.log('Creating draft order with store domain:', STORE_DOMAIN)

    const body = await request.json() as DraftOrderRequestBody
    const { bagPrice, dogName, note, deliveryInfo, bonusItems } = body

    // Prepare line items
    const lineItems = [
      {
        title: "Puppy Palentines Bag",
        price: bagPrice.toFixed(2),
        quantity: 1,
        custom: true,
        properties: [
          { name: "Dog Name", value: dogName },
          { name: "Note", value: note },
          { name: "Delivery Info", value: deliveryInfo }
        ]
      },
      ...bonusItems.map((item) => {
        // Extract numeric ID from the GraphQL ID
        const numericId = item.variantId.split('/').pop() || ''
        return {
          variant_id: numericId,
          quantity: item.quantity
        }
      })
    ]

    console.log('Draft order payload:', {
      line_items: lineItems,
      note: `Puppy Palentines Order for ${dogName}`,
      shipping_address: deliveryInfo.includes('Need to find:') 
        ? null 
        : {
            address1: deliveryInfo.split(',')[0].trim(),
            city: deliveryInfo.split(',')[1].trim(),
            province: deliveryInfo.split(',')[2].trim().split(' ')[1],
            zip: deliveryInfo.split(',')[2].trim().split(' ')[2],
            country: 'US'
          }
    })

    // Create draft order
    const response = await fetch(
      `https://${STORE_DOMAIN}/admin/api/2024-01/draft_orders.json`,
      {
        method: 'POST',
        headers: new Headers({
          'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN,
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          draft_order: {
            line_items: lineItems,
            note: `Puppy Palentines Order for ${dogName}`,
            shipping_address: deliveryInfo.includes('Need to find:') 
              ? null 
              : {
                  address1: deliveryInfo.split(',')[0].trim(),
                  city: deliveryInfo.split(',')[1].trim(),
                  province: deliveryInfo.split(',')[2].trim().split(' ')[1],
                  zip: deliveryInfo.split(',')[2].trim().split(' ')[2],
                  country: 'US'
                }
          }
        })
      }
    )

    if (!response.ok) {
      const error = await response.json()
      console.error('Draft order API error response:', error)
      throw new Error(`Failed to create draft order: ${JSON.stringify(error)}`)
    }

    const data = await response.json()
    console.log('Draft order response:', data)
    
    if (!data?.draft_order?.id) {
      throw new Error('No draft order ID returned')
    }
    
    // Send invoice with retry mechanism
    const invoice = await sendInvoiceWithRetry(data.draft_order.id, dogName)
    
    if (!invoice?.invoice_url) {
      throw new Error('No invoice URL returned')
    }
    
    return NextResponse.json({ 
      invoiceUrl: invoice.invoice_url 
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create draft order' },
      { status: 500 }
    )
  }
} 