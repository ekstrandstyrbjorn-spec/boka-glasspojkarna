import { booqableV1 } from '@/lib/booqable/client'

export async function GET() {
  const results: Record<string, unknown> = {}

  // Test v1 customer with main_address_attributes + phone variations
  try {
    const c = await booqableV1.post<unknown>('/customers', {
      customer: {
        name: 'Test Adress Format',
        email: 'adress2@glasspojkarna.se',
        phone: '070-123 45 67',
        main_address_attributes: {
          address1: 'Testgatan 1',
          city: 'Stockholm',
          zipcode: '11122',
          country: 'SE',
        },
      },
    })
    results.customer_v1 = c
  } catch (e) {
    results.customer_v1_error = String(e)
  }

  return Response.json(results)
}
