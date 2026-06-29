'use client'
import { useState, useEffect, use } from 'react'
import { BookingProgress } from '@/components/booking/BookingProgress'
import { StepDate } from '@/components/booking/StepDate'
import { StepExtras } from '@/components/booking/StepExtras'
import { ContactForm } from '@/components/booking/ContactForm'
import { BookingSummary } from '@/components/booking/BookingSummary'
import { useBookingState } from '@/hooks/useBookingState'
import type { Package } from '@/lib/types'

export default function BookingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { currentStep, update } = useBookingState()
  const [pkg, setPkg] = useState<Package | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/packages/${slug}`)
      .then(r => r.json())
      .then((data: Package) => {
        setPkg(data)
        update({
          packageId: data.id,
          packageSlug: data.slug,
          packageName: data.name,
          packagePriceInCents: data.basePriceInCents,
        })
      })
      .catch(() => setPkg(null))
      .finally(() => setLoading(false))
  }, [slug, update])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[var(--color-ink-secondary)] pt-16">
        Laddar…
      </div>
    )
  }

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <p className="text-xl font-bold text-[var(--color-ink)] mb-2">Paketet hittades inte</p>
          <a href="/" className="text-[var(--color-brand)] hover:underline">← Tillbaka till alla paket</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-xl mx-auto px-4 pb-24">
        <BookingProgress currentStep={currentStep} />
        <div className="mt-4">
          {currentStep === 1 && <StepDate pkg={pkg} />}
          {currentStep === 2 && <StepExtras pkg={pkg} />}
          {currentStep === 3 && <ContactForm />}
          {currentStep === 4 && <BookingSummary />}
        </div>
      </div>
    </div>
  )
}
