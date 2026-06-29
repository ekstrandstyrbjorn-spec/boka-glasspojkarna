'use client'
import { useState } from 'react'
import { CategoryFilter } from './CategoryFilter'
import { PackageCard } from './PackageCard'
import type { Package, PackageCategory } from '@/lib/types'

export function PackageGrid({ packages }: { packages: Package[] }) {
  const [activeCategory, setActiveCategory] = useState<PackageCategory | 'all'>('all')

  const filtered = activeCategory === 'all'
    ? packages
    : packages.filter(p => p.category === activeCategory)

  return (
    <section id="packages" className="max-w-6xl mx-auto px-4 py-24">
      <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-ink)] mb-3 text-center">
        Välj ditt paket
      </h2>
      <p className="text-[var(--color-ink-secondary)] text-center mb-10 max-w-xl mx-auto">
        Alla paket inkluderar maskin, ingredienser och tillbehör. Boka direkt online.
      </p>

      <div className="flex justify-center mb-10 overflow-x-auto">
        <CategoryFilter activeCategory={activeCategory} onChange={setActiveCategory} />
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-[var(--color-ink-secondary)] py-16">Inga paket hittades.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
        </div>
      )}
    </section>
  )
}
