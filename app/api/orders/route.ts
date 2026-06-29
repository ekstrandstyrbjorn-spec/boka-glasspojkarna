import { NextRequest, NextResponse } from 'next/server'
import { createOrder } from '@/lib/booqable/orders'
import type { BookingState } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const state: BookingState = await req.json()
    const confirmation = await createOrder(state)
    return NextResponse.json(confirmation)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
