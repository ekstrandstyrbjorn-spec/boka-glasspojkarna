'use client'
export const dynamic = 'force-dynamic'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div
          className="w-20 h-20 rounded-full bg-[var(--color-success)] flex items-center justify-center text-white text-4xl mx-auto mb-8"
          aria-hidden="true"
        >
          ✓
        </div>
        <h1 className="text-3xl font-bold text-[var(--color-ink)] mb-4">Bokning bekräftad!</h1>
        <p className="text-[var(--color-ink-secondary)] mb-2">
          Vi har tagit emot din bokning och skickar en bekräftelse till din e-post.
        </p>
        {mounted && orderId && (
          <p className="text-sm text-[var(--color-ink-tertiary)] mb-8">
            Bokningsnummer: <span className="font-mono font-semibold">{orderId}</span>
          </p>
        )}
        {!mounted && <div className="h-6 mb-8" />}
        <p className="text-[var(--color-ink-secondary)] mb-8">
          Har du frågor? Ring oss på{' '}
          <a href="tel:+46850924501" className="font-semibold text-[var(--color-brand)] hover:underline">
            08-509 245 01
          </a>
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center font-semibold px-8 py-3 rounded-[var(--radius-button)] bg-[var(--color-brand)] text-white hover:opacity-90 transition-all"
        >
          Tillbaka till startsidan
        </Link>
      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-16 flex items-center justify-center text-[var(--color-ink-secondary)]">
        Laddar…
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  )
}
