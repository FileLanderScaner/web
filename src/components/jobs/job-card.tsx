import Link from 'next/link'
import type { Job } from '@/types/database'

interface JobCardProps {
  job: Job & {
    company: { name: string; slug: string; logo_url: string | null } | null
  }
}

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

export function JobCard({ job }: JobCardProps) {
  return (
    <Link
      href={`/jobs/${job.slug}`}
      className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-emerald-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-emerald-600"
    >
      <div className="mb-3 flex items-start justify-between">
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
            <p className="text-sm text-slate-500 dark:text-slate-400">{job.company?.name ?? 'Sin empresa'}</p>
          </div>
        </div>
        {job.featured && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            Destacado
          </span>
        )}
      </div>

      <div className="mb-4 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
          {job.remote ? '100% Remoto' : job.location ?? 'Presencial'}
        </span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
          {employmentLabels[job.employment_type] ?? job.employment_type}
        </span>
        {job.experience_level && (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
            {experienceLabels[job.experience_level] ?? job.experience_level}
          </span>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          {job.salary_min != null && job.salary_max != null && (
            <span className="font-medium text-slate-700 dark:text-slate-300">
              ${job.salary_min.toLocaleString()} – ${job.salary_max.toLocaleString()}
            </span>
          )}
        </div>
        {job.location && <span>{job.location}</span>}
      </div>
    </Link>
  )
}
