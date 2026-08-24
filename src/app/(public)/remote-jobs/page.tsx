import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { JobCard } from '@/components/jobs/job-card'
import type { Job } from '@/types/database'

export const metadata = {
  title: 'Empleos 100% remotos',
  description: 'Explora empleos totalmente remotos en tecnología, diseño, marketing y más. Trabaja desde cualquier lugar del mundo.',
}

export default async function RemoteJobsPage() {
  const supabase = await createClient()

  const { data: jobs } = await supabase
    .from('jobs')
    .select('*, company:companies(name, slug, logo_url)')
    .eq('status', 'published')
    .eq('remote', true)
    .order('featured', { ascending: false })
    .order('published_at', { ascending: false })
    .limit(24)

  const jobsList = (jobs ?? []) as (Job & { company: { name: string; slug: string; logo_url: string | null } | null })[]

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-800">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Empleos 100% remotos
          </h1>
          <p className="mx-auto mb-6 max-w-2xl text-lg text-violet-100">
            Trabaja desde donde quieras. Todos nuestros empleos son totalmente remotos,
            sin importar tu ubicación geográfica.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-violet-200">
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              Trabaja desde cualquier lugar
            </span>
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Horarios flexibles
            </span>
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
              Sin oficina física
            </span>
          </div>
        </div>
      </section>

      {/* Job listing */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {jobsList.length} empleo{jobsList.length !== 1 ? 's' : ''} remoto{jobsList.length !== 1 ? 's' : ''}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Publicados recientemente
            </p>
          </div>
          <Link
            href="/jobs?remote=true"
            className="text-sm font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400"
          >
            Ver todos →
          </Link>
        </div>

        {jobsList.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white py-16 text-center dark:border-slate-700 dark:bg-slate-800">
            <p className="text-lg font-medium text-slate-900 dark:text-white">
              Aún no hay empleos remotos publicados
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Vuelve pronto para ver nuevas oportunidades
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobsList.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* Benefits CTA */}
      <section className="bg-slate-50 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="mb-8 text-center text-2xl font-bold text-slate-900 dark:text-white">
            ¿Por qué trabajar remoto?
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { title: 'Libertad geográfica', desc: 'Vive donde quieras sin depender de una oficina. Viaja, muévete o quédate en casa.' },
              { title: 'Mejor equilibrio', desc: 'Sin horas de commute, más tiempo para ti y tu familia. Define tu propia rutina.' },
              { title: 'Oportunidades globales', desc: 'Accede a empresas de todo el mundo, no solo las de tu ciudad o país.' },
            ].map(({ title, desc }) => (
              <div key={title} className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
                <h3 className="mb-2 font-semibold text-slate-900 dark:text-white">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
