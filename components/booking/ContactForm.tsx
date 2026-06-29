'use client'
import { Button } from '@/components/ui/Button'
import { useBookingState } from '@/hooks/useBookingState'

export function ContactForm() {
  const { state, update, setStep } = useBookingState()

  const canProceed = state.firstName.trim() && state.lastName.trim() && state.email.trim() && state.phone.trim()

  const field = (
    label: string,
    key: keyof typeof state,
    type = 'text',
    required = true,
    autocomplete?: string
  ) => (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-[var(--color-ink)]">
        {label}{required && ' *'}
      </span>
      <input
        type={type}
        value={state[key] as string}
        onChange={e => update({ [key]: e.target.value })}
        required={required}
        autoComplete={autocomplete}
        className="px-4 py-3 rounded-[var(--radius-input)] border border-[var(--color-border)] focus:border-[var(--color-brand)] focus:outline-none text-[var(--color-ink)] bg-white"
      />
    </label>
  )

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Dina uppgifter</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field('Förnamn', 'firstName', 'text', true, 'given-name')}
        {field('Efternamn', 'lastName', 'text', true, 'family-name')}
      </div>
      {field('E-post', 'email', 'email', true, 'email')}
      {field('Telefon', 'phone', 'tel', true, 'tel')}

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-[var(--color-ink)]">Adress för leverans</span>
        <input
          type="text"
          value={state.address}
          onChange={e => update({ address: e.target.value })}
          autoComplete="street-address"
          className="px-4 py-3 rounded-[var(--radius-input)] border border-[var(--color-border)] focus:border-[var(--color-brand)] focus:outline-none text-[var(--color-ink)] bg-white"
        />
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-[var(--color-ink)]">Postnummer</span>
          <input
            type="text"
            value={state.postalCode}
            onChange={e => update({ postalCode: e.target.value })}
            autoComplete="postal-code"
            className="px-4 py-3 rounded-[var(--radius-input)] border border-[var(--color-border)] focus:border-[var(--color-brand)] focus:outline-none text-[var(--color-ink)] bg-white"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-[var(--color-ink)]">Stad</span>
          <input
            type="text"
            value={state.city}
            onChange={e => update({ city: e.target.value })}
            autoComplete="address-level2"
            className="px-4 py-3 rounded-[var(--radius-input)] border border-[var(--color-border)] focus:border-[var(--color-brand)] focus:outline-none text-[var(--color-ink)] bg-white"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-[var(--color-ink)]">Meddelande (frivilligt)</span>
        <textarea
          value={state.notes}
          onChange={e => update({ notes: e.target.value })}
          rows={3}
          className="px-4 py-3 rounded-[var(--radius-input)] border border-[var(--color-border)] focus:border-[var(--color-brand)] focus:outline-none text-[var(--color-ink)] bg-white resize-none"
        />
      </label>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => setStep(2)}>← Tillbaka</Button>
        <Button disabled={!canProceed} onClick={() => setStep(4)}>Granska bokning →</Button>
      </div>
    </div>
  )
}
