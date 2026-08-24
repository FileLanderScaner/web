import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Company } from '@/types/database'

export const metadata = {
  title: 'Empresas que contratan remoto',
  description: 'Descubre empresas verificadas que ofrecen empleos 100% remotos. Conoce sus beneficios y cultura.',
}

export default async function CompaniesPage() {
  const supabase = await createClient()

  const { data: companies } = await supabase
    .from('companies')
    .select('*')
    .order('name')

  const companiesList = (companies ?? []) as Company[]

  // Fetch job counts per company
  const companyCounts = await Promise.all(
    companiesList.map(async (comp) => {
      const { count } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', comp.id)
        .eq('status', 'published')
      return { id: comp.id, count: count ?? 0 }
    })
  )

  const countMap = new Map(companyCounts.map((c) => [c.id, c.count]))

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Empresas que contratan remoto
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-blue-100">
            Conoce las empresas que ofrecen empleos 100% remotos. Explora sus vacantes,
            beneficios y cultura organizacional.
          </p>
        </div>
      </section>

      {/* Company listing */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        {companiesList.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white py-16 text-center dark:border-slate-700 dark:bg-slate-800">
            <p className="text-lg font-medium text-slate-900 dark:text-white">
              Aún no hay empresas registradas
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Vuelve pronto para ver empresas que contratan remoto
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {companiesList.map((company) => (
              <Link
                key={company.id}
                href={`/jobs?company=${company.slug}`}
                className="group flex flex-col rounded-xl border border-slate-200 bg-white p-6 transition-all hover:border-blue-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-600"
              >
                <div className="mb-4 flex items-center gap-4">
                  {company.logo_url ? (
                    <img
                      src={company.logo_url}
                      alt={company.name}
                      className="h-14 w-14 rounded-xl object-contain"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-xl font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      {company.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      {company.name}
                    </h3>
                    {company.verified && (
                      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        ✓ Verificada
                      </span>
                    )}
                  </div>
                </div>

                {company.description && (
                  <p className="mb-4 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                    {company.description}
                  </p>
                )}

                <div className="mt-auto flex flex-wrap gap-2 text-xs text-slate-400 dark:text-slate-500">
                  {company.hq_location && (
                    <span className="flex items-center gap-1">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                      </svg>
                      {company.hq_location}
                    </span>
                  )}
                  {company.size && (
                    <span className="flex items-center gap-1">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                      </svg>
                      {company.size}
                    </span>
                  )}
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    {countMap.get(company.id) ?? 0} empleo{(countMap.get(company.id) ?? 0) !== 1 ? 's' : ''}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
