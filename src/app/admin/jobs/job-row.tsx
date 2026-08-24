'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { deleteJobAction, toggleJobStatus, toggleJobFeatured } from './actions'

interface JobRowProps {
  job: {
    id: string
    slug: string
    title: string
    status: string
    featured: boolean
    remote: boolean
    employment_type: string
    published_at: string | null
    created_at: string
    company_name: string
  }
  statusLabels: Record<string, string>
  statusColors: Record<string, string>
}

export function JobRow({ job, statusLabels, statusColors }: JobRowProps) {
  const [pending, startTransition] = useTransition()

  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
      <td className="px-4 py-3">
        <Link href={`/jobs/${job.slug}`} className="font-medium text-slate-900 hover:text-emerald-600 dark:text-white dark:hover:text-emerald-400">
          {job.title}
        </Link>
        <p className="text-xs text-slate-400 dark:text-slate-500">{job.employment_type}</p>
      </td>
      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{job.company_name}</td>
      <td className="px-4 py-3">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[job.status] ?? ''}`}>
          {statusLabels[job.status] ?? job.status}
        </span>
      </td>
      <td className="px-4 py-3">
        {job.remote ? (
          <span className="text-emerald-600 dark:text-emerald-400">✓</span>
        ) : (
          <span className="text-slate-300 dark:text-slate-600">—</span>
        )}
      </td>
      <td className="px-4 py-3">
        {job.featured ? (
          <span className="text-amber-500">★</span>
        ) : (
          <span className="text-slate-300 dark:text-slate-600">—</span>
        )}
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => startTransition(() => toggleJobStatus(job.id, job.status))}
            disabled={pending}
            className="rounded px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
          >
            {job.status === 'published' ? 'Ocultar' : 'Publicar'}
          </button>
          <button
            onClick={() => startTransition(() => toggleJobFeatured(job.id, job.featured))}
            disabled={pending}
            className="rounded px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
          >
            {job.featured ? 'Quitar ★' : 'Destacar ★'}
          </button>
          <button
            onClick={() => {
              if (confirm('¿Eliminar este empleo?')) {
                startTransition(() => deleteJobAction(job.id))
              }
            }}
            disabled={pending}
            className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  )
}
