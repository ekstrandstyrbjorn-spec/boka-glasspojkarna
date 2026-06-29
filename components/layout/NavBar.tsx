'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export function NavBar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-[var(--duration-base)]
        ${scrolled ? 'backdrop-blur-md bg-white/80 shadow-sm' : 'bg-transparent'}
      `}
    >
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="https://glasspojkarna.se"
          className="text-xl font-bold text-[var(--color-ink)] hover:text-[var(--color-brand)] transition-colors"
          aria-label="Glasspojkarna — tillbaka till startsidan"
        >
          Glasspojkarna
        </Link>
        <a
          href="tel:+46850924501"
          className="flex items-center gap-2 text-sm font-medium text-[var(--color-ink-secondary)] hover:text-[var(--color-brand)] transition-colors"
          aria-label="Ring oss på 08-509 245 01"
        >
          <span className="hidden sm:inline">08-509 245 01</span>
          <span className="sm:hidden" aria-hidden="true">📞</span>
        </a>
      </nav>
    </header>
  )
}
