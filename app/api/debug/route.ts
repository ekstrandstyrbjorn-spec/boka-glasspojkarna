import { booqableV1 } from '@/lib/booqable/client'

export async function GET() {
  const results: Record<string, unknown> = {}

  // Test v1 customer creation with phone + address
  try {
    const c = await booqableV1.post<unknown>('/customers', {
      customer: {
        name: 'Test Med Telefon',
        email: 'telefon@glasspojkarna.se',
        phone: '070-123 45 67',
        address1: 'Testgatan 1',
        city: 'Stockholm',
        zipcode: '11122',
        country: 'SE',
      },
    })
    results.customer_v1 = c
  } catch (e) {
    results.customer_v1_error = String(e)
  }

  return Response.json(results)
}
