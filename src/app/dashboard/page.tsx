import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { requireProfile } from '@/lib/auth'

export default async function DashboardPage() {
  const { user, profile } = await requireProfile()
  const supabase = await createClient()

  const [savedRes, appsRes, alertsRes, jobsRes] = await Promise.all([
    supabase
      .from('saved_jobs')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id),
    supabase
      .from('applications')
      .select('*, job:jobs(id, slug, title, company:companies(name, slug))')
      .eq('user_id', user.id)
      .order('applied_at', { ascending: false })
      .limit(5),
    supabase
      .from('job_alerts')
      .select('active')
      .eq('user_id', user.id),
    supabase
      .from('jobs')
      .select('id, slug, title, company:companies(name, slug)')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(5),
  ])

  const savedCount = savedRes.count ?? 0
  const appsCount = (appsRes.data ?? []).length
  const activeAlertsCount = (alertsRes.data ?? []).filter((a) => a.active).length

  const statusLabels: Record<string, string> = {
    applied: 'Postulado',
    interviewing: 'En entrevista',
    offer: 'Oferta',
    rejected: 'Rechazado',
    hired: 'Contratado',
    withdrawn: 'Retirado',
  }

  const statusColors: Record<string, string> = {
    applied: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    interviewing: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    offer: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    hired: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    withdrawn: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Hola, {profile.full_name?.split(' ')[0] ?? 'there'} 👋
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Aquí tienes un resumen de tu actividad reciente
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Guardados', value: savedCount, href: '/dashboard/saved', color: 'emerald' },
          { label: 'Postulaciones', value: appsCount, href: '/dashboard/applications', color: 'blue' },
          { label: 'Alertas activas', value: activeAlertsCount, href: '/dashboard/alerts', color: 'amber' },
          { label: 'Empleos nuevos', value: jobsRes.data?.length ?? 0, href: '/jobs', color: 'violet' },
        ].map(({ label, value, href, color }) => (
          <Link
            key={label}
            href={href}
            className="rounded-xl border border-slate-200 bg-white p-4 transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
          >
            <p className={`text-2xl font-bold text-${color}-600 dark:text-${color}-400`}>{value}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent applications */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900 dark:text-white">Postulaciones recientes</h2>
            <Link href="/dashboard/applications" className="text-xs font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">
              Ver todas
            </Link>
          </div>
          {appsRes.data?.length === 0 ? (
            <p className="py-4 text-center text-sm text-slate-400 dark:text-slate-500">Aún no te has postulado a ningún empleo</p>
          ) : (
            <ul className="space-y-3">
              {appsRes.data?.map((app) => {
                const job = app.job as { slug: string; title: string; company: { name: string } | null } | null
                return (
                  <li key={app.id}>
                    <Link href={`/jobs/${job?.slug ?? ''}`} className="group block">
                      <p className="text-sm font-medium text-slate-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                        {job?.title ?? 'Empleo eliminado'}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span>{job?.company?.name ?? ''}</span>
                        <span>·</span>
                        <span className={`rounded-full px-2 py-0.5 font-medium ${statusColors[app.status] ?? ''}`}>
                          {statusLabels[app.status] ?? app.status}
                        </span>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        {/* Latest jobs */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900 dark:text-white">Últimos empleos publicados</h2>
            <Link href="/jobs" className="text-xs font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">
              Ver todos
            </Link>
          </div>
          <ul className="space-y-3">
            {jobsRes.data?.map((job) => {
              const company = job.company as { name: string; slug: string } | null
              return (
                <li key={job.id}>
                  <Link href={`/jobs/${job.slug}`} className="group flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                        {job.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{company?.name ?? ''}</p>
                    </div>
                    <span className="text-xs text-slate-400 dark:text-slate-500">→</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      </div>
    </div>
  )
}
