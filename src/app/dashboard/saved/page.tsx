import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { requireUser } from '@/lib/auth'

export const metadata = { title: 'Guardados — Dashboard' }

export default async function SavedPage() {
  const user = await requireUser()
  const supabase = await createClient()

  const { data: saved } = await supabase
    .from('saved_jobs')
    .select('created_at, job_id, job:jobs(id, slug, title, company:companies(name, slug, logo_url))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Guardados</h1>

      {!saved || saved.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white py-16 text-center dark:border-slate-700 dark:bg-slate-800">
          <p className="text-lg font-medium text-slate-900 dark:text-white">No tienes empleos guardados</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Guarda empleos que te interesen para revisarlos después
          </p>
          <Link href="/jobs" className="mt-4 inline-block rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
            Explorar empleos
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {saved.map((s) => {
            const job = s.job as { id: string; slug: string; title: string; company: { name: string; slug: string; logo_url: string | null } | null } | null
            if (!job) return null
            return (
              <Link
                key={s.job_id}
                href={`/jobs/${job.slug}`}
                className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-emerald-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-emerald-600"
              >
                <div className="flex items-center gap-3">
                  {job.company?.logo_url ? (
                    <img src={job.company.logo_url} alt={job.company.name} className="h-10 w-10 rounded-lg object-contain" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                      {job.company?.name?.charAt(0) ?? '?'}
                    </div>
                  )}
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                      {job.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{job.company?.name ?? ''}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
