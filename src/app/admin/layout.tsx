import Link from 'next/link'
import { requireAdmin } from '@/lib/auth'
import { site } from '@/lib/site'
import { AdminNav } from '@/components/layout/admin-nav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, profile } = await requireAdmin()

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-50 border-b border-violet-200 bg-violet-50/80 backdrop-blur-md dark:border-violet-900 dark:bg-violet-950/50">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-bold text-slate-900 dark:text-white">
            {site.name}
          </Link>
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-900 dark:text-violet-300">
              Admin
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {profile.full_name ?? user.email ?? ''}
            </span>
            <Link href="/" className="text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
              Volver al sitio
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-0 px-0 lg:gap-6 lg:px-4">
        <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white lg:block dark:border-slate-800 dark:bg-slate-950">
          <AdminNav />
        </aside>
        <main className="flex-1 px-4 py-6 lg:px-0">{children}</main>
      </div>
    </div>
  )
}
