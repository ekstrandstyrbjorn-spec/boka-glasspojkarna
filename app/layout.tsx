import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NavBar } from '@/components/layout/NavBar'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Boka partypaket – Glasspojkarna',
  description: 'Boka glassmaskiner, popcornmaskiner, slushmaskin och sockervaddsmaskin direkt online. Allt inkluderat, boka på minuter.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv">
      <body className={`${inter.variable} font-sans`}>
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  )
}
