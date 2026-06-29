'use client'
import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { formatSEK } from '@/lib/price'
import type { Package } from '@/lib/types'

const CATEGORY_LABELS: Record<string, string> = {
  glass: 'Glassmaskin',
  popcorn: 'Popcornmaskin',
  slush: 'Slushmaskin',
  sockervadds: 'Sockervaddsmaskin',
}

export function PackageCard({ pkg }: { pkg: Package }) {
  const reduce = useReducedMotion()

  return (
    <motion.article
      className="bg-[var(--color-surface-raised)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] overflow-hidden flex flex-col group"
      whileHover={reduce ? {} : { y: -4, boxShadow: 'var(--shadow-card-hover)' }}
      transition={{ duration: 0.22 }}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-cream)]">
        {pkg.imageUrl ? (
          <Image
            src={pkg.imageUrl}
            alt={pkg.name}
            fill
            className="object-cover transition-transform duration-[var(--duration-slow)] group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl" aria-hidden="true">🎉</div>
        )}
        {pkg.isPopular && (
          <div className="absolute top-3 left-3">
            <Badge>Populärt</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-secondary)] mb-1">
            {CATEGORY_LABELS[pkg.category] ?? pkg.category}
          </p>
          <h3 className="text-xl font-bold text-[var(--color-ink)]">{pkg.name}</h3>
          {pkg.description && (
            <p className="text-sm text-[var(--color-ink-secondary)] mt-1 line-clamp-2">{pkg.description}</p>
          )}
        </div>

        {pkg.inclusions.length > 0 && (
          <ul className="text-sm text-[var(--color-ink-secondary)] space-y-1">
            {pkg.inclusions.slice(0, 3).map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-[var(--color-brand)] font-bold shrink-0" aria-hidden="true">✓</span>
                <span>{item.label}{item.quantity ? ` (${item.quantity})` : ''}</span>
              </li>
            ))}
          </ul>
        )}

        <p className="text-xs text-[var(--color-ink-tertiary)]">
          Passar upp till <strong className="text-[var(--color-ink)]">{pkg.guestsMax} gäster</strong>
        </p>

        <div className="mt-auto pt-3 border-t border-[var(--color-border)] flex items-center justify-between gap-2">
          <div>
            <p className="text-xs text-[var(--color-ink-tertiary)]">Från</p>
            <p className="text-2xl font-bold text-[var(--color-ink)] tabular-nums">
              {formatSEK(pkg.basePriceInCents)}
            </p>
          </div>
          <div className="flex flex-col gap-1.5 items-end">
            <Link
              href={`/paket/${pkg.slug}/boka`}
              className="inline-flex items-center justify-center font-semibold px-4 py-2 text-sm rounded-[var(--radius-button)] bg-[var(--color-brand)] text-white hover:opacity-90 transition-all"
            >
              Boka nu
            </Link>
            <Link
              href={`/paket/${pkg.slug}`}
              className="text-xs text-[var(--color-ink-secondary)] hover:text-[var(--color-brand)] transition-colors"
            >
              Läs mer →
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
