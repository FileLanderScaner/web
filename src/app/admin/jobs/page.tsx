import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { JobRow } from './job-row'

export const metadata = { title: 'Empleos — Admin' }

export default async function AdminJobsPage() {
  const supabase = await createClient()

  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, slug, title, status, featured, remote, employment_type, published_at, created_at, company:companies(name, slug)')
    .order('created_at', { ascending: false })

  const statusLabels: Record<string, string> = {
    draft: 'Borrador',
    published: 'Publicado',
    expired: 'Expirado',
    archived: 'Archivado',
  }

  const statusColors: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
    published: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    expired: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    archived: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Empleos</h1>
        <Link
          href="/admin/jobs/new"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          + Nuevo empleo
        </Link>
      </div>

      {!jobs || jobs.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white py-16 text-center dark:border-slate-700 dark:bg-slate-800">
          <p className="text-lg font-medium text-slate-900 dark:text-white">No hay empleos</p>
          <Link href="/admin/jobs/new" className="mt-3 inline-block text-sm font-medium text-emerald-600 hover:text-emerald-700">
            Crear el primero
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-medium uppercase text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Empresa</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Remoto</th>
                <th className="px-4 py-3">Destacado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {jobs.map((job) => {
                const company = job.company as { name: string; slug: string } | null
                return (
                  <JobRow
                    key={job.id}
                    job={{
                      ...job,
                      company_name: company?.name ?? '',
                    }}
                    statusLabels={statusLabels}
                    statusColors={statusColors}
                  />
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
