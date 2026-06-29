import { NextRequest, NextResponse } from 'next/server'
import { checkAvailability } from '@/lib/booqable/availability'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const productId = searchParams.get('productId')
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')

  if (!productId || !startDate || !endDate) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  try {
    const available = await checkAvailability(productId, startDate, endDate)
    return NextResponse.json({ available })
  } catch {
    return NextResponse.json({ error: 'Could not check availability' }, { status: 500 })
  }
}
