import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Job, Company } from '@/types/database'

const experienceLabels: Record<string, string> = {
  junior: 'Junior',
  mid: 'Mid-level',
  senior: 'Senior',
  lead: 'Lead',
}

const employmentLabels: Record<string, string> = {
  full_time: 'Tiempo completo',
  part_time: 'Medio tiempo',
  contract: 'Contrato',
  freelance: 'Freelance',
  internship: 'Pasantía',
  temporary: 'Temporal',
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('jobs')
    .select('title, company:companies(name)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  if (!data) return { title: 'Empleo no encontrado' }
  const company = data.company as { name: string } | null
  return { title: `${data.title} — ${company?.name ?? ''}` }
}

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: job } = await supabase
    .from('jobs')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!job) notFound()

  const [companyRes, categoriesRes] = await Promise.all([
    supabase.from('companies').select('*').eq('id', job.company_id).single(),
    supabase
      .from('job_categories')
      .select('category:categories(name, slug)')
      .eq('job_id', job.id),
  ])

  const company = companyRes.data as Company | null
  const cats = (categoriesRes.data ?? []) as { category: { name: string; slug: string } | null }[]

  const j = job as Job

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <nav className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        <Link href="/jobs" className="hover:text-emerald-600 dark:hover:text-emerald-400">Empleos</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900 dark:text-white">{j.title}</span>
      </nav>

      <article className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800 sm:p-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            {company?.logo_url ? (
              <img src={company.logo_url} alt={company.name} className="h-14 w-14 rounded-xl object-contain" />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100 text-xl font-bold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                {company?.name?.charAt(0) ?? '?'}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{j.title}</h1>
              {company && (
                <Link href={`/companies/${company.slug}`} className="text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400">
                  {company.name}
                </Link>
              )}
            </div>
          </div>
          {j.featured && (
            <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              Destacado
            </span>
          )}
        </div>

        {/* Meta */}
        <div className="mb-6 flex flex-wrap gap-2">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            {j.remote ? '100% Remoto' : j.location ?? 'Presencial'}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
            {employmentLabels[j.employment_type] ?? j.employment_type}
          </span>
          {j.experience_level && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
              {experienceLabels[j.experience_level] ?? j.experience_level}
            </span>
          )}
          {j.salary_min != null && j.salary_max != null && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
              ${j.salary_min.toLocaleString()} – ${j.salary_max.toLocaleString()} {j.salary_currency}
            </span>
          )}
        </div>

        {/* Categories */}
        {cats.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {cats.map((c) =>
              c.category ? (
                <Link
                  key={c.category.slug}
                  href={`/jobs?category=${c.category.slug}`}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:border-emerald-300 hover:text-emerald-600 dark:border-slate-600 dark:text-slate-300 dark:hover:border-emerald-600 dark:hover:text-emerald-400"
                >
                  {c.category.name}
                </Link>
              ) : null
            )}
          </div>
        )}

        {/* Description */}
        <div className="prose prose-slate max-w-none dark:prose-invert">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Descripción</h2>
          <div className="whitespace-pre-line text-slate-600 dark:text-slate-300">{j.description}</div>
        </div>

        {/* Requirements */}
        {j.requirements && (
          <div className="prose prose-slate mt-6 max-w-none dark:prose-invert">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Requisitos</h2>
            <div className="whitespace-pre-line text-slate-600 dark:text-slate-300">{j.requirements}</div>
          </div>
        )}

        {/* Benefits */}
        {j.benefits && (
          <div className="prose prose-slate mt-6 max-w-none dark:prose-invert">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Beneficios</h2>
            <div className="whitespace-pre-line text-slate-600 dark:text-slate-300">{j.benefits}</div>
          </div>
        )}

        {/* Skills */}
        {j.skills.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">Habilidades</h2>
            <div className="flex flex-wrap gap-2">
              {j.skills.map((skill) => (
                <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Apply */}
        <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 dark:border-slate-700 sm:flex-row">
          {j.source_url ? (
            <a
              href={j.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              Aplicar en la web externa →
            </a>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              Iniciar sesión para aplicar
            </Link>
          )}
        </div>

        {/* Footer meta */}
        <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-400 dark:text-slate-500">
          {j.published_at && (
            <span>Publicado: {new Date(j.published_at).toLocaleDateString('es')}</span>
          )}
          {j.expires_at && (
            <span>Cierra: {new Date(j.expires_at).toLocaleDateString('es')}</span>
          )}
          <span>{j.view_count} vistas</span>
        </div>
      </article>
    </div>
  )
}
