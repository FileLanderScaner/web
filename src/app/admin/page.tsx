import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'

export const metadata = { title: 'Admin — Resumen' }

export default async function AdminPage() {
  const { profile } = await requireAdmin()
  const supabase = await createClient()

  const [jobsRes, companiesRes, categoriesRes, usersRes] = await Promise.all([
    supabase.from('jobs').select('id, status', { count: 'exact' }),
    supabase.from('companies').select('id', { count: 'exact' }),
    supabase.from('categories').select('id', { count: 'exact' }),
    supabase.from('profiles').select('id', { count: 'exact' }),
  ])

  const totalJobs = jobsRes.count ?? 0
  const publishedJobs = (jobsRes.data ?? []).filter((j) => j.status === 'published').length
  const totalCompanies = companiesRes.count ?? 0
  const totalCategories = categoriesRes.count ?? 0
  const totalUsers = usersRes.count ?? 0

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Panel de administración</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Bienvenido, {profile.full_name ?? profile.role}
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Empleos', value: totalJobs, sub: `${publishedJobs} publicados`, href: '/admin/jobs', color: 'emerald' },
          { label: 'Empresas', value: totalCompanies, sub: null, href: '/admin/companies', color: 'blue' },
          { label: 'Categorías', value: totalCategories, sub: null, href: '/admin/categories', color: 'amber' },
          { label: 'Usuarios', value: totalUsers, sub: null, href: '/admin/users', color: 'violet' },
        ].map(({ label, value, sub, href, color }) => (
          <Link
            key={label}
            href={href}
            className="rounded-xl border border-slate-200 bg-white p-5 transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
          >
            <p className={`text-3xl font-bold text-${color}-600 dark:text-${color}-400`}>{value}</p>
            <p className="text-sm font-medium text-slate-900 dark:text-white">{label}</p>
            {sub && <p className="text-xs text-slate-500 dark:text-slate-400">{sub}</p>}
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: '/admin/jobs', label: 'Gestionar empleos', icon: '💼' },
          { href: '/admin/companies', label: 'Gestionar empresas', icon: '🏢' },
          { href: '/admin/categories', label: 'Gestionar categorías', icon: '📁' },
          { href: '/admin/users', label: 'Gestionar usuarios', icon: '👥' },
        ].map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-violet-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-violet-600"
          >
            <span className="text-2xl">{icon}</span>
            <span className="font-medium text-slate-900 dark:text-white">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
