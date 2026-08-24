'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

const filterLabels: Record<string, string> = {
  q: 'Búsqueda',
  category: 'Categoría',
  remote: 'Remoto',
  experience: 'Experiencia',
  employment: 'Contrato',
  company: 'Empresa',
}

export function ActiveFilters({ searchParams }: { searchParams: Record<string, string> }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function removeFilter(key: string) {
    const params = new URLSearchParams()
    for (const [k, v] of Object.entries(searchParams)) {
      if (k !== key && k !== 'page') {
        params.set(k, v)
      }
    }
    startTransition(() => {
      router.push(`/jobs?${params.toString()}`)
    })
  }

  function clearAll() {
    startTransition(() => {
      router.push('/jobs')
    })
  }

  const entries = Object.entries(searchParams).filter(([k]) => k !== 'page')

  if (entries.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Filtros:</span>
      {entries.map(([key, value]) => (
        <span
          key={key}
          className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
        >
          {filterLabels[key] ?? key}: {value.replace(/-/g, ' ')}
          <button
            onClick={() => removeFilter(key)}
            className="ml-0.5 rounded-full p-0.5 hover:bg-emerald-100 dark:hover:bg-emerald-800"
            aria-label={`Quitar filtro ${filterLabels[key] ?? key}`}
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      ))}
      <button
        onClick={clearAll}
        disabled={pending}
        className="text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
      >
        Limpiar todo
      </button>
    </div>
  )
}
