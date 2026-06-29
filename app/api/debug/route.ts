import { booqable } from '@/lib/booqable/client'

export async function GET() {
  const results: Record<string, unknown> = {}

  // Step 1: List product groups
  try {
    const products = await booqable.get<unknown>('/product_groups?filter[product_type]=rental')
    results.products = products
  } catch (e) {
    results.products_error = String(e)
    return Response.json(results)
  }

  // Step 2: Create a test customer
  let customerId: string
  try {
    const customer = await booqable.post<{ data: { id: string } }>('/customers', {
      data: {
        type: 'customers',
        attributes: { name: 'Test Kund', email: 'test@glasspojkarna.se' },
      },
    })
    customerId = customer.data.id
    results.customer_id = customerId
  } catch (e) {
    results.customer_error = String(e)
    return Response.json(results)
  }

  // Step 3: Create a test order
  let orderId: string
  try {
    const order = await booqable.post<{ data: { id: string; attributes: { number: string } } }>('/orders', {
      data: {
        type: 'orders',
        attributes: {
          starts_at: '2026-08-01T08:00:00Z',
          stops_at: '2026-08-02T20:00:00Z',
        },
        relationships: {
          customer: { data: { type: 'customers', id: customerId } },
        },
      },
    })
    orderId = order.data.id
    results.order_id = orderId
    results.order_number = order.data.attributes.number
  } catch (e) {
    results.order_error = String(e)
    return Response.json(results)
  }

  results.success = true
  return Response.json(results)
}
