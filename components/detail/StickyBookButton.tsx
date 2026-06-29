'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatSEK } from '@/lib/price'

interface Props { slug: string; priceInCents: number; name: string }

export function StickyBookButton({ slug, priceInCents, name }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.4)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-white/90 backdrop-blur-md shadow-[var(--shadow-sticky)] flex items-center justify-between gap-4 sm:hidden"
      role="complementary"
      aria-label="Snabbbokning"
    >
      <div>
        <p className="text-xs text-[var(--color-ink-secondary)] truncate max-w-[160px]">{name}</p>
        <p className="font-bold text-[var(--color-ink)] tabular-nums">Från {formatSEK(priceInCents)}</p>
      </div>
      <Link
        href={`/paket/${slug}/boka`}
        className="inline-flex items-center justify-center font-semibold px-6 py-3 text-base rounded-[var(--radius-button)] bg-[var(--color-brand)] text-white hover:opacity-90 transition-all shrink-0"
      >
        Boka nu
      </Link>
    </div>
  )
}
