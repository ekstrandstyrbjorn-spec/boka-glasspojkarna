import { booqable } from '@/lib/booqable/client'

export async function GET() {
  const results: Record<string, unknown> = {}

  // Use existing order from earlier debug (Aug 15 order, status=new)
  const orderId = 'c2647087-7adf-4b0d-a957-2588c7148a3b'
  const productId = '36e90601-0fc4-4fdd-a7ba-80ce0f146b74'   // products type
  const productGroupId = '6540b76e-65a8-490c-98ea-08059183191c' // product_groups type

  // Try 1: POST /plannings with relationships
  try {
    const p = await booqable.post<unknown>('/plannings', {
      data: {
        type: 'plannings',
        attributes: { quantity: 1 },
        relationships: {
          order: { data: { type: 'orders', id: orderId } },
          item: { data: { type: 'products', id: productId } },
        },
      },
    })
    results.planning_result = p
  } catch (e) {
    results.planning_error = String(e)
  }

  // Try 2: PATCH the order with sideposted line using lid
  try {
    const p = await booqable.patch<unknown>(`/orders/${orderId}`, {
      data: {
        type: 'orders',
        id: orderId,
        attributes: {},
      },
      included: [
        {
          type: 'lines',
          lid: 'new-line-1',
          attributes: { quantity: 1 },
          relationships: {
            item: { data: { type: 'products', id: productId } },
          },
        },
      ],
    })
    results.patch_sidepost_result = p
  } catch (e) {
    results.patch_sidepost_error = String(e)
  }

  // Try 3: POST /lines with order_id as query param
  try {
    const p = await booqable.post<unknown>(`/lines?filter[order_id]=${orderId}`, {
      data: {
        type: 'lines',
        attributes: { quantity: 1, item_id: productGroupId },
      },
    })
    results.lines_query_param_result = p
  } catch (e) {
    results.lines_query_param_error = String(e)
  }

  return Response.json(results)
}
