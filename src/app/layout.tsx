import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { site } from '@/lib/site'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: `${site.name} — Empleos remotos`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  ),
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'es_UY',
    siteName: site.name,
    title: `${site.name} — Empleos remotos`,
    description: site.description,
  },
  twitter: {
    card: 'summary',
    title: `${site.name} — Empleos remotos`,
    description: site.description,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
