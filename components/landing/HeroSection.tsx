'use client'
import { useReducedMotion } from 'framer-motion'

export function HeroSection() {
  const reduce = useReducedMotion()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-[var(--color-cream)]"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" aria-hidden="true" />

      {/* Content */}
      <div
        className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto pt-16"
        style={reduce ? {} : { animation: 'fadeUp 0.8s ease-out forwards' }}
      >
        <h1 className="text-[40px] sm:text-[64px] lg:text-[80px] font-bold leading-[1.05] tracking-tight mb-6 drop-shadow-lg">
          Gör festen<br />oförglömlig
        </h1>
        <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-xl mx-auto drop-shadow">
          Allt inkluderat. Boka på några minuter.
        </p>
        <a
          href="#packages"
          className="inline-flex items-center justify-center font-semibold px-8 py-4 text-lg rounded-[var(--radius-button)] bg-[var(--color-brand)] text-white hover:opacity-90 active:scale-[0.98] transition-all duration-[var(--duration-fast)] shadow-lg"
        >
          Se alla paket
        </a>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}
