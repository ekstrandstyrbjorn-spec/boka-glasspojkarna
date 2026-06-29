import { HeroSection } from '@/components/landing/HeroSection'
import { PackageGrid } from '@/components/landing/PackageGrid'
import { getPackages } from '@/lib/booqable/products'
import type { Package } from '@/lib/types'

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
