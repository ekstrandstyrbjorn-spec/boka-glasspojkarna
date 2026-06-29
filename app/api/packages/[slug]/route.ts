import { NextRequest, NextResponse } from 'next/server'
import { getPackage } from '@/lib/booqable/products'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const pkg = await getPackage(slug)
    return NextResponse.json(pkg)
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
