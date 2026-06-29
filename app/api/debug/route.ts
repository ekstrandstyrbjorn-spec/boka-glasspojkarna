import { booqable } from '@/lib/booqable/client'

export async function GET() {
  try {
    const data = await booqable.get<unknown>('/product_groups?filter[product_type]=rental')
    return Response.json({ ok: true, data })
  } catch (e) {
    return Response.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
