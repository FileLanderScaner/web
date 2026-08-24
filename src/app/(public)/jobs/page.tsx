import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { JobCard } from '@/components/jobs/job-card'
import { SearchBar } from '@/components/jobs/search-bar'
import { FilterSidebar } from '@/components/jobs/filter-sidebar'
import { Pagination } from '@/components/jobs/pagination'
import { ActiveFilters } from '@/components/jobs/active-filters'
import type { Job, Category } from '@/types/database'

const PAGE_SIZE = 12

export async function generateMetadata({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams
  const parts = ['Empleos remotos']
  if (params.q) parts.push(`"${params.q}"`)
  if (params.category) parts.push(params.category)
  if (params.remote === 'true') parts.push('100% remoto')
  if (params.experience) parts.push(params.experience)
  return { title: parts.join(' — ') }
}

interface JobsPageProps {
  searchParams: Promise<{
    q?: string
    category?: string
    remote?: string
    experience?: string
    employment?: string
    company?: string
    page?: string
  }>
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams
  const supabase = await createClient()

  const q = params.q?.trim() ?? ''
  const category = params.category ?? ''
  const remote = params.remote ?? ''
  const experience = params.experience ?? ''
  const employment = params.employment ?? ''
  const company = params.company ?? ''
  const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1)

  let query = supabase
    .from('jobs')
    .select('*, company:companies(name, slug, logo_url)', { count: 'exact' })
    .eq('status', 'published')

  if (q) {
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`)
  }
  if (remote === 'true') {
    query = query.eq('remote', true)
  } else if (remote === 'false') {
    query = query.eq('remote', false)
  }
  if (experience && ['junior', 'mid', 'senior', 'lead'].includes(experience)) {
    query = query.eq('experience_level', experience as 'junior' | 'mid' | 'senior' | 'lead')
  }
  if (employment && ['full_time', 'part_time', 'contract', 'freelance', 'internship', 'temporary'].includes(employment)) {
    query = query.eq('employment_type', employment as 'full_time' | 'part_time' | 'contract' | 'freelance' | 'internship' | 'temporary')
  }

  // Company filter
  if (company) {
    const { data: comp } = await supabase
      .from('companies')
      .select('id')
      .eq('slug', company)
      .single()
    if (comp) {
      query = query.eq('company_id', comp.id)
    } else {
      query = query.eq('id', '00000000-0000-0000-0000-000000000000')
    }
  }

  // Category filter via job_categories join
  if (category) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category)
      .single()
    if (cat) {
      const { data: jobIds } = await supabase
        .from('job_categories')
        .select('job_id')
        .eq('category_id', cat.id)
      if (jobIds && jobIds.length > 0) {
        query = query.in('id', jobIds.map((r) => r.job_id))
      } else {
        query = query.eq('id', '00000000-0000-0000-0000-000000000000')
      }
    } else {
      query = query.eq('id', '00000000-0000-0000-0000-000000000000')
    }
  }

  const { count } = await query
  const totalJobs = count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalJobs / PAGE_SIZE))

  const { data: jobs } = await query
    .order('featured', { ascending: false })
    .order('published_at', { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  const jobsList = (jobs ?? []) as (Job & { company: { name: string; slug: string; logo_url: string | null } | null })[]
  const categoriesList = (categories ?? []) as Category[]

  const searchParamsObj: Record<string, string> = {}
  if (q) searchParamsObj.q = q
  if (category) searchParamsObj.category = category
  if (remote) searchParamsObj.remote = remote
  if (experience) searchParamsObj.experience = experience
  if (employment) searchParamsObj.employment = employment
  if (company) searchParamsObj.company = company

  const hasFilters = q || category || remote || experience || employment || company

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {company ? `Empleos en ${company.replace(/-/g, ' ')}` : 'Empleos remotos'}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {totalJobs} empleo{totalJobs !== 1 ? 's' : ''} encontrado{totalJobs !== 1 ? 's' : ''}
          {q && <> para &quot;{q}&quot;</>}
        </p>
      </div>

      <div className="mb-6">
        <Suspense>
          <SearchBar defaultValue={q} />
        </Suspense>
      </div>

      {hasFilters && (
        <div className="mb-6">
          <Suspense>
            <ActiveFilters searchParams={searchParamsObj} />
          </Suspense>
        </div>
      )}

      <div className="flex flex-col gap-8 lg:flex-row">
        <Suspense>
          <FilterSidebar categories={categoriesList} />
        </Suspense>

        <div className="flex-1">
          {jobsList.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white py-16 text-center dark:border-slate-700 dark:bg-slate-800">
              <p className="text-lg font-medium text-slate-900 dark:text-white">No se encontraron empleos</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Intenta ajustar los filtros o buscar algo diferente
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                {jobsList.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
              <div className="mt-8">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  searchParams={searchParamsObj}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
