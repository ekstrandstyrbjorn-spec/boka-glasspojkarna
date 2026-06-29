'use client'
import { useState } from 'react'

interface FAQItem { question: string; answer: string }

const FAQ_ITEMS: FAQItem[] = [
  { question: 'Hur lång tid tar leveransen?', answer: 'Vi levererar och hämtar utrustningen. Leveranstid och plats bokas när vi bekräftar din order.' },
  { question: 'Ingår rengöring?', answer: 'Grundrengöring ingår för slushmaskin i XL-paketet. För övriga paket kan städning läggas till som tillval.' },
  { question: 'Kan jag hämta paketet själv?', answer: 'Ja, upphämtning i Sollentuna är kostnadsfri.' },
  { question: 'Vad händer om något går sönder?', answer: 'Ring oss direkt på 08-509 245 01 — vi hjälper dig.' },
  { question: 'Kan jag boka samma dag?', answer: 'Vi försöker alltid hjälpa till. Ring oss för akuta bokningar.' },
]

export function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="max-w-3xl mx-auto px-4 py-16">
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">Vanliga frågor</h2>
      <div className="space-y-2">
        {FAQ_ITEMS.map((item, i) => (
          <div key={i} className="border border-[var(--color-border)] rounded-[var(--radius-card)] overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex justify-between items-center px-6 py-4 text-left font-semibold text-[var(--color-ink)] hover:text-[var(--color-brand)] transition-colors"
              aria-expanded={open === i}
              aria-controls={`faq-answer-${i}`}
            >
              <span>{item.question}</span>
              <span
                aria-hidden="true"
                className={`ml-4 transition-transform duration-[var(--duration-base)] shrink-0 ${open === i ? 'rotate-180' : ''}`}
              >
                ▾
              </span>
            </button>
            <div
              id={`faq-answer-${i}`}
              role="region"
              hidden={open !== i}
              className="px-6 pb-4 text-[var(--color-ink-secondary)] text-sm leading-relaxed"
            >
              {item.answer}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
