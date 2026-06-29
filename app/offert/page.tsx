'use client'
import { useState } from 'react'

interface FormState {
  name: string
  email: string
  phone: string
  eventDate: string
  guests: string
  packageInterest: string
  message: string
}

const INITIAL: FormState = {
  name: '', email: '', phone: '', eventDate: '', guests: '', packageInterest: '', message: '',
}

export default function QuotePage() {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const update = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    // Mailto fallback — in production this would POST to a form API
    const subject = encodeURIComponent(`Offertförfrågan från ${form.name}`)
    const body = encodeURIComponent(
      `Namn: ${form.name}\nE-post: ${form.email}\nTelefon: ${form.phone}\nEventdatum: ${form.eventDate}\nAntal gäster: ${form.guests}\nPackage: ${form.packageInterest}\n\n${form.message}`
    )
    window.location.href = `mailto:info@glasspojkarna.se?subject=${subject}&body=${body}`
    setSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-[var(--color-brand)] flex items-center justify-center text-white text-3xl mx-auto mb-8" aria-hidden="true">
            ✉
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-ink)] mb-4">Tack för din förfrågan!</h1>
          <p className="text-[var(--color-ink-secondary)] mb-8">
            Vi återkommer till dig inom 24 timmar. Har du bråttom? Ring{' '}
            <a href="tel:+46850924501" className="font-semibold text-[var(--color-brand)] hover:underline">08-509 245 01</a>.
          </p>
          <a href="/" className="inline-flex items-center justify-center font-semibold px-8 py-3 rounded-[var(--radius-button)] bg-[var(--color-brand)] text-white hover:opacity-90 transition-all">
            Tillbaka till startsidan
          </a>
        </div>
      </div>
    )
  }

  const inputClass = "px-4 py-3 rounded-[var(--radius-input)] border border-[var(--color-border)] focus:border-[var(--color-brand)] focus:outline-none text-[var(--color-ink)] bg-white w-full"

  return (
    <div className="min-h-screen pt-16 pb-24 px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-ink)] mb-3">Begär offert</h1>
          <p className="text-[var(--color-ink-secondary)]">
            Planerar du ett större event? Fyll i formuläret så återkommer vi med ett skräddarsytt erbjudande.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-[var(--color-ink)]">Namn *</span>
              <input type="text" value={form.name} onChange={update('name')} required autoComplete="name" className={inputClass} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-[var(--color-ink)]">Telefon *</span>
              <input type="tel" value={form.phone} onChange={update('phone')} required autoComplete="tel" className={inputClass} />
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-[var(--color-ink)]">E-post *</span>
            <input type="email" value={form.email} onChange={update('email')} required autoComplete="email" className={inputClass} />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-[var(--color-ink)]">Eventdatum</span>
              <input type="date" value={form.eventDate} onChange={update('eventDate')} className={inputClass} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-[var(--color-ink)]">Antal gäster</span>
              <input type="number" min="1" value={form.guests} onChange={update('guests')} placeholder="t.ex. 150" className={inputClass} />
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-[var(--color-ink)]">Intresserat paket</span>
            <select value={form.packageInterest} onChange={update('packageInterest')} className={inputClass}>
              <option value="">Välj paket...</option>
              <option value="Glassmaskin">Glassmaskin</option>
              <option value="Popcornmaskin">Popcornmaskin</option>
              <option value="Slushmaskin">Slushmaskin</option>
              <option value="Sockervaddsmaskin">Sockervaddsmaskin</option>
              <option value="Kombination">Kombination av flera</option>
              <option value="Vet inte">Vet inte än</option>
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-[var(--color-ink)]">Berätta mer om ditt event</span>
            <textarea
              value={form.message}
              onChange={update('message')}
              rows={4}
              placeholder="Plats, önskemål, budget..."
              className={`${inputClass} resize-none`}
            />
          </label>

          <button
            type="submit"
            disabled={submitting || !form.name || !form.email || !form.phone}
            className="w-full inline-flex items-center justify-center font-semibold px-8 py-4 text-lg rounded-[var(--radius-button)] bg-[var(--color-brand)] text-white hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? 'Skickar…' : 'Skicka offertförfrågan'}
          </button>
        </form>
      </div>
    </div>
  )
}
