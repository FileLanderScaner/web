'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signOutAction } from '@/app/(auth)/actions'
import type { Profile } from '@/types/database'

export function UserMenu({ profile, email }: { profile: Profile; email?: string | null }) {
  const [open, setOpen] = useState(false)
  const displayEmail = email ?? ''

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-300"
        aria-label="Menú de usuario"
        aria-expanded={open}
      >
        {(profile.full_name ?? displayEmail ?? 'U').charAt(0).toUpperCase()}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
            <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
              <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                {profile.full_name ?? 'Usuario'}
              </p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                {displayEmail}
              </p>
            </div>
            <nav className="py-1">
              <Link href="/dashboard" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
                Dashboard
              </Link>
              <Link href="/dashboard/saved" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
                Guardados
              </Link>
              <Link href="/dashboard/profile" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
                Mi perfil
              </Link>
              {profile.role === 'admin' && (
                <Link href="/admin" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
                  Administración
                </Link>
              )}
            </nav>
            <div className="border-t border-slate-100 py-1 dark:border-slate-800">
              <button
                onClick={() => { setOpen(false); signOutAction() }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-slate-50 dark:text-red-400 dark:hover:bg-slate-800"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
