import { NextRequest, NextResponse } from 'next/server'
import { createOrder } from '@/lib/booqable/orders'
import type { BookingState } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const state: BookingState = await req.json()
    const confirmation = await createOrder(state)
    return NextResponse.json(confirmation)
  } catch {
    return NextResponse.json({ error: 'Could not create order' }, { status: 500 })
  }
}
