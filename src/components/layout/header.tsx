'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOutAction } from '@/app/(auth)/actions'
import { site } from '@/lib/site'
import { cn } from '@/lib/utils'
import { UserMenu } from './user-menu'
import type { Profile } from '@/types/database'

const navLinks = [
  { href: '/jobs', label: 'Empleos' },
  { href: '/remote-jobs', label: 'Remotos' },
  { href: '/categories', label: 'Categorías' },
]

export function Header({ profile, email }: { profile: Profile | null; email?: string | null }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-slate-900 dark:text-white">
          {site.name}
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                pathname.startsWith(href)
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800',
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {profile ? (
            <UserMenu profile={profile} email={email} />
          ) : (
            <>
              <Link href="/login" className="hidden text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white md:block">
                Iniciar sesión
              </Link>
              <Link href="/register" className="hidden rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 md:block">
                Crear cuenta
              </Link>
            </>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 md:hidden"
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {mobileOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  pathname.startsWith(href)
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800',
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
            {profile ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800">
                  Dashboard
                </Link>
                <button
                  onClick={() => { setMobileOpen(false); signOutAction() }}
                  className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-center text-sm font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800">
                  Iniciar sesión
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} className="rounded-lg bg-emerald-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-emerald-700">
                  Crear cuenta
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
