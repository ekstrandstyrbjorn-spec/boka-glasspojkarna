import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPackage, getPackages } from '@/lib/booqable/products'
import { PackageHero } from '@/components/detail/PackageHero'
import { InclusionList } from '@/components/detail/InclusionList'
import { GalleryGrid } from '@/components/detail/GalleryGrid'
import { FAQAccordion } from '@/components/detail/FAQAccordion'
import { StickyBookButton } from '@/components/detail/StickyBookButton'

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const pkg = await getPackage(slug).catch(() => null)
  if (!pkg) return {}
  return {
    title: `${pkg.name} – Glasspojkarna`,
    description: pkg.description || `Boka ${pkg.name} direkt online. Passar upp till ${pkg.guestsMax} gäster.`,
    openGraph: {
      title: `${pkg.name} – Glasspojkarna`,
      images: pkg.imageUrl ? [{ url: pkg.imageUrl }] : [],
    },
  }
}

export async function generateStaticParams() {
  try {
    const packages = await getPackages()
    return packages.map(p => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export default async function PackageDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const pkg = await getPackage(slug).catch(() => null)
  if (!pkg) notFound()

  return (
    <>
      <PackageHero pkg={pkg} />
      <InclusionList inclusions={pkg.inclusions} />
      <GalleryGrid images={pkg.gallery} />
      <FAQAccordion />
      <StickyBookButton slug={pkg.slug} priceInCents={pkg.basePriceInCents} name={pkg.name} />
      <div className="h-24" aria-hidden="true" />
    </>
  )
}
