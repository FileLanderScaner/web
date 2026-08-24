import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { requireUser } from '@/lib/auth'

export const metadata = { title: 'Postulaciones — Dashboard' }

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

export default async function ApplicationsPage() {
  const user = await requireUser()
  const supabase = await createClient()

  const { data: applications } = await supabase
    .from('applications')
    .select('id, status, notes, applied_at, updated_at, job:jobs(id, slug, title, company:companies(name, slug))')
    .eq('user_id', user.id)
    .order('applied_at', { ascending: false })

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Postulaciones</h1>

      {(!applications || applications.length === 0) ? (
        <div className="rounded-xl border border-slate-200 bg-white py-16 text-center dark:border-slate-700 dark:bg-slate-800">
          <p className="text-lg font-medium text-slate-900 dark:text-white">Aún no te has postulado</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Registra tus postulaciones para hacer seguimiento
          </p>
          <Link href="/jobs" className="mt-4 inline-block rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
            Explorar empleos
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app: { id: string; status: string; notes: string | null; applied_at: string; job: { id: string; slug: string; title: string; company: { name: string; slug: string } | null } | null }) => (
            <div key={app.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                  {app.job?.company?.name?.charAt(0) ?? '?'}
                </div>
                <div>
                  <Link href={`/jobs/${app.job?.slug ?? ''}`} className="text-sm font-medium text-slate-900 hover:text-emerald-600 dark:text-white dark:hover:text-emerald-400">
                    {app.job?.title ?? 'Empleo eliminado'}
                  </Link>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{app.job?.company?.name ?? ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[app.status] ?? ''}`}>
                  {statusLabels[app.status] ?? app.status}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {new Date(app.applied_at).toLocaleDateString('es')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
