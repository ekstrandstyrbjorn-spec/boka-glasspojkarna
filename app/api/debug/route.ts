import { booqable } from '@/lib/booqable/client'

export async function GET() {
  const results: Record<string, unknown> = {}

  const orderId = 'e0a2f37f-c2ca-4e3b-9e43-738482187899'
  // The actual product variant ID (child of product_group Glass S)
  const productId = '36e90601-0fc4-4fdd-a7ba-80ce0f146b74'
  // The product_group ID for Glass S
  const productGroupId = '6540b76e-65a8-490c-98ea-08059183191c'

  // Try 1: nested route POST /orders/{id}/lines with product variant
  try {
    const r = await booqable.post<unknown>(`/orders/${orderId}/lines`, {
      data: {
        type: 'lines',
        attributes: { quantity: 1, item_id: productId },
      },
    })
    results.nested_product = r
  } catch (e) {
    results.nested_product_error = String(e)
  }

  // Try 2: nested route with product_group id
  try {
    const r = await booqable.post<unknown>(`/orders/${orderId}/lines`, {
      data: {
        type: 'lines',
        attributes: { quantity: 1, item_id: productGroupId },
      },
    })
    results.nested_product_group = r
  } catch (e) {
    results.nested_product_group_error = String(e)
  }

  return Response.json(results)
}
