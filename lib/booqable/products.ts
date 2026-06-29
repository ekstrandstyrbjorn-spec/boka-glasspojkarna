import { booqable } from './client'
import type { Package, PackageCategory } from '@/lib/types'

interface BooqableProductGroup {
  id: string
  attributes: {
    name: string
    description: string
    base_price_in_cents: number
    slug: string
    photo_url?: string
    extra_information?: string
  }
}

function parseCategoryAndTier(name: string): { category: PackageCategory; tier: 'S' | 'L' | 'XL' } {
  const parts = name.toLowerCase().split(' ')
  const tierMap: Record<string, 'S' | 'L' | 'XL'> = { s: 'S', l: 'L', xl: 'XL' }
  const categoryMap: Record<string, PackageCategory> = {
    glass: 'glass', popcorn: 'popcorn', slush: 'slush', sockervadds: 'sockervadds',
  }
  return {
    category: categoryMap[parts[0]] ?? 'glass',
    tier: tierMap[parts[1]] ?? 'S',
  }
}

export async function getPackages(): Promise<Package[]> {
  const res = await booqable.get<{ data: BooqableProductGroup[] }>(
    '/product_groups?filter[product_type]=rental'
  )
  return res.data.map(pg => {
    const { category, tier } = parseCategoryAndTier(pg.attributes.name)
    let meta: Record<string, unknown> = {}
    try {
      if (pg.attributes.extra_information) {
        meta = JSON.parse(pg.attributes.extra_information)
      }
    } catch {
      // extra_information not set or not valid JSON — use defaults
    }
    return {
      id: pg.id,
      slug: pg.attributes.slug,
      name: pg.attributes.name,
      category,
      tier,
      description: pg.attributes.description ?? '',
      guestsMax: (meta.guestsMax as number) ?? 50,
      basePriceInCents: pg.attributes.base_price_in_cents,
      inclusions: (meta.inclusions as Package['inclusions']) ?? [],
      addOns: (meta.addOns as Package['addOns']) ?? [],
      imageUrl: pg.attributes.photo_url ?? '',
      gallery: (meta.gallery as string[]) ?? [],
      isPopular: tier === 'L',
    }
  })
}

export async function getPackage(slug: string): Promise<Package> {
  const packages = await getPackages()
  const pkg = packages.find(p => p.slug === slug)
  if (!pkg) throw new Error(`Package not found: ${slug}`)
  return pkg
}
