import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { site } from '@/lib/site'
import { JobCard } from '@/components/jobs/job-card'
import { CategoryCard } from '@/components/categories/category-card'
import type { Job, Category, Company } from '@/types/database'

export default async function HomePage() {
  const supabase = await createClient()

  const [jobsRes, categoriesRes, companiesRes] = await Promise.all([
    supabase
      .from('jobs')
      .select('*, company:companies(name, slug, logo_url)')
      .eq('status', 'published')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(6),
    supabase
      .from('categories')
      .select('*')
      .order('name'),
    supabase
      .from('companies')
      .select('*')
      .order('name'),
  ])

  const jobs = (jobsRes.data ?? []) as (Job & { company: { name: string; slug: string; logo_url: string | null } | null })[]
  const categories = (categoriesRes.data ?? []) as Category[]
  const companies = (companiesRes.data ?? []) as Company[]

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 text-center sm:py-28">
          <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            {site.tagline}
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-emerald-100 sm:text-xl">
            {site.description}
          </p>

          <form action="/jobs" method="GET" className="mx-auto flex max-w-2xl flex-col gap-3 sm:flex-row">
            <input
              type="text"
              name="q"
              placeholder="Buscar empleo, empresa o categoría..."
              className="flex-1 rounded-xl border-0 bg-white px-5 py-3.5 text-base text-slate-900 shadow-lg placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-300"
            />
            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-colors hover:bg-slate-800"
            >
              Buscar
            </button>
          </form>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm text-emerald-200">
            <span>Populares:</span>
            {['Desarrollador', 'Diseñador', 'Marketing', 'Datos'].map((term) => (
              <Link
                key={term}
                href={`/jobs?q=${encodeURIComponent(term)}`}
                className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/25"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-8 sm:grid-cols-4">
          {[
            { value: `${jobs.length}+`, label: 'Empleos publicados' },
            { value: `${companies.length}+`, label: 'Empresas activas' },
            { value: `${categories.length}`, label: 'Categorías' },
            { value: '100%', label: 'Remotos' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Jobs */}
      {jobs.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Empleos destacados</h2>
              <p className="mt-1 text-slate-500 dark:text-slate-400">Las mejores oportunidades remotas de esta semana</p>
            </div>
            <Link href="/jobs" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">
              Ver todos →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="bg-slate-50 dark:bg-slate-900">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Explora por categoría</h2>
              <p className="mt-1 text-slate-500 dark:text-slate-400">Encuentra empleos en tu área de expertise</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Companies */}
      {companies.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Empresas que contratan remoto</h2>
            <p className="mt-1 text-slate-500 dark:text-slate-400">Compañías verificadas con oportunidades abiertas</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {companies.slice(0, 8).map((company) => (
              <Link
                key={company.id}
                href={`/companies/${company.slug}`}
                className="flex h-20 w-44 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 transition-all hover:border-emerald-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-emerald-600"
              >
                {company.logo_url ? (
                  <img src={company.logo_url} alt={company.name} className="max-h-10 max-w-full object-contain" />
                ) : (
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{company.name}</span>
                )}
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/companies" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">
              Ver todas las empresas →
            </Link>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl">
            No te pierdas ningún empleo
          </h2>
          <p className="mb-8 text-emerald-100">
            Crea alertas personalizadas y recibe correos cuando se publiquen empleos que coincidan con tu perfil.
          </p>
          <Link
            href="/register"
            className="inline-block rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-emerald-700 shadow-lg transition-colors hover:bg-emerald-50"
          >
            Crear alerta gratuita
          </Link>
        </div>
      </section>
    </>
  )
}
