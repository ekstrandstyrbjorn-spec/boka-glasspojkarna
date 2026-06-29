const STEPS = ['Datum', 'Tillval', 'Uppgifter', 'Bekräfta']

export function BookingProgress({ currentStep }: { currentStep: number }) {
  return (
    <nav aria-label="Bokningssteg" className="flex items-center justify-center gap-2 py-6">
      {STEPS.map((label, i) => {
        const step = i + 1
        const done = step < currentStep
        const active = step === currentStep
        return (
          <div key={step} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                ${done ? 'bg-[var(--color-success)] text-white' : ''}
                ${active ? 'bg-[var(--color-brand)] text-white' : ''}
                ${!done && !active ? 'bg-[var(--color-surface-raised)] text-[var(--color-ink-tertiary)] border border-[var(--color-border)]' : ''}
              `} aria-current={active ? 'step' : undefined}>
                {done ? '✓' : step}
              </div>
              <span className={`text-xs hidden sm:block ${active ? 'text-[var(--color-brand)] font-semibold' : 'text-[var(--color-ink-tertiary)]'}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-8 sm:w-16 h-px mb-5 ${done ? 'bg-[var(--color-success)]' : 'bg-[var(--color-border)]'}`} aria-hidden="true" />
            )}
          </div>
        )
      })}
    </nav>
  )
}
