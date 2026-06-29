import Image from 'next/image'
import Link from 'next/link'
import { formatSEK } from '@/lib/price'
import type { Package } from '@/lib/types'

export function PackageHero({ pkg }: { pkg: Package }) {
  return (
    <section className="pt-16">
      <div className="relative h-[50vh] sm:h-[60vh] min-h-[320px] bg-[var(--color-cream)]">
        {pkg.imageUrl && (
          <Image src={pkg.imageUrl} alt={pkg.name} fill className="object-cover" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 text-white max-w-6xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest text-white/70 mb-2">Partypaket</p>
          <h1 className="text-4xl sm:text-6xl font-bold mb-4">{pkg.name}</h1>
          <div className="flex items-center gap-6 flex-wrap">
            <span className="text-2xl font-bold">Från {formatSEK(pkg.basePriceInCents)}</span>
            <span className="text-white/80">Upp till {pkg.guestsMax} gäster</span>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-6 flex justify-end">
        <Link
          href={`/paket/${pkg.slug}/boka`}
          className="inline-flex items-center justify-center font-semibold px-8 py-4 text-lg rounded-[var(--radius-button)] bg-[var(--color-brand)] text-white hover:opacity-90 transition-all"
        >
          Boka nu
        </Link>
      </div>
    </section>
  )
}
