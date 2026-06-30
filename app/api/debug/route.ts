import { booqableV1 } from '@/lib/booqable/client'

export async function GET() {
  const results: Record<string, unknown> = {}

  // Fetch the customer we patched last time to see if address saved
  const customerId = '00852647-93e3-405c-8d68-e624853e1b8e'
  try {
    const c = await booqableV1.get<unknown>(`/customers/${customerId}`)
    results.customer = c
  } catch (e) {
    results.error = String(e)
  }

  return Response.json(results)
}
