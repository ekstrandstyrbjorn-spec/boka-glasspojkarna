import { booqableV1 } from '@/lib/booqable/client'

export async function GET() {
  const results: Record<string, unknown> = {}

  // Create customer first
  let customerId: string
  try {
    const c = await booqableV1.post<{ customer: { id: string } }>('/customers', {
      customer: { name: 'Patch Test', email: 'patch@glasspojkarna.se' },
    })
    customerId = c.customer.id
    results.created_id = customerId
  } catch (e) { results.create_error = String(e); return Response.json(results) }

  // Try PATCH with flat address fields + phone
  try {
    const u = await booqableV1.patch<unknown>(`/customers/${customerId}`, {
      customer: {
        phone: '070-123 45 67',
        address1: 'Testgatan 1',
        city: 'Stockholm',
        zipcode: '11122',
        country: 'SE',
      },
    })
    results.patch_result = u
  } catch (e) {
    results.patch_error = String(e)
  }

  return Response.json(results)
}
