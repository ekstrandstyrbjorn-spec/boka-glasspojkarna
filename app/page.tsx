import { HeroSection } from '@/components/landing/HeroSection'
import { PackageGrid } from '@/components/landing/PackageGrid'
import { getPackages } from '@/lib/booqable/products'
import type { Package } from '@/lib/types'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Boka partypaket – Glasspojkarna',
  description: 'Boka glassmaskiner, popcornmaskiner, slushmaskin och sockervaddsmaskin direkt online. Allt inkluderat, boka på 2 minuter.',
  openGraph: {
    title: 'Boka partypaket – Glasspojkarna',
    description: 'Glassmaskiner, popcorn, slush & sockervadds. Allt inkluderat. Boka direkt online.',
    url: 'https://boka.glasspojkarna.se',
    siteName: 'Glasspojkarna',
    locale: 'sv_SE',
    type: 'website',
  },
}

export default async function LandingPage() {
  let packages: Package[] = []
  try {
    packages = await getPackages()
  } catch {
    // Booqable not configured yet — show empty grid in development
  }

  return (
    <>
      <HeroSection />
      <PackageGrid packages={packages} />
    </>
  )
}
