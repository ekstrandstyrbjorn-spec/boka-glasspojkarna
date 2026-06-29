import { MetadataRoute } from 'next'
import { getPackages } from '@/lib/booqable/products'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://boka.glasspojkarna.se'

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/offert`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  let packageRoutes: MetadataRoute.Sitemap = []
  try {
    const packages = await getPackages()
    packageRoutes = packages.map(pkg => ({
      url: `${base}/paket/${pkg.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch {
    // Booqable not configured yet
  }

  return [...staticRoutes, ...packageRoutes]
}
