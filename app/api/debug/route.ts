import { booqable } from '@/lib/booqable/client'

export async function GET() {
  const results: Record<string, unknown> = {}

  // Fetch the test order created earlier
  try {
    const order = await booqable.get<unknown>('/orders/6556034f-7597-4656-848d-dcc20a5b1e0e')
    results.existing_order = order
  } catch (e) {
    results.existing_order_error = String(e)
  }

  // List all orders
  try {
    const orders = await booqable.get<unknown>('/orders')
    results.all_orders = orders
  } catch (e) {
    results.all_orders_error = String(e)
  }

  return Response.json(results)
}
