import Link from 'next/link'
import { requireProfile } from '@/lib/auth'
import { site } from '@/lib/site'
import { DashboardNav } from '@/components/layout/dashboard-nav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, profile } = await requireProfile()

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-bold text-slate-900 dark:text-white">
            {site.name}
          </Link>
          <div className="flex items-center gap-3">
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
          <DashboardNav />
        </aside>
        <main className="flex-1 px-4 py-6 lg:px-0">{children}</main>
      </div>
    </div>
  )
}
