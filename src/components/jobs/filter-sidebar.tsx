'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import type { Category } from '@/types/database'

interface FilterSidebarProps {
  categories: Category[]
}

const experienceOptions = [
  { value: 'junior', label: 'Junior' },
  { value: 'mid', label: 'Mid-level' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead' },
]

const employmentOptions = [
  { value: 'full_time', label: 'Tiempo completo' },
  { value: 'part_time', label: 'Medio tiempo' },
  { value: 'contract', label: 'Contrato' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'internship', label: 'Pasantía' },
  { value: 'temporary', label: 'Temporal' },
]

export function FilterSidebar({ categories }: FilterSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()

  const currentCategory = searchParams.get('category') ?? ''
  const currentRemote = searchParams.get('remote') ?? ''
  const currentExperience = searchParams.get('experience') ?? ''
  const currentEmployment = searchParams.get('employment') ?? ''

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page')
    startTransition(() => {
      router.push(`/jobs?${params.toString()}`)
    })
  }

  return (
    <aside className="w-full shrink-0 space-y-6 lg:w-64">
      {pending && (
        <div className="fixed inset-0 z-50 bg-white/50 dark:bg-slate-950/50" />
      )}

      {/* Category */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">Categoría</h3>
        <div className="space-y-1">
          <button
            onClick={() => updateParam('category', '')}
            className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
              !currentCategory
                ? 'bg-emerald-50 font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            Todas
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateParam('category', cat.slug)}
              className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                currentCategory === cat.slug
                  ? 'bg-emerald-50 font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Remote */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">Modalidad</h3>
        <div className="space-y-1">
          {[
            { value: '', label: 'Todas' },
            { value: 'true', label: '100% Remoto' },
            { value: 'false', label: 'Presencial / Híbrido' },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => updateParam('remote', value)}
              className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                currentRemote === value
                  ? 'bg-emerald-50 font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">Experiencia</h3>
        <div className="space-y-1">
          <button
            onClick={() => updateParam('experience', '')}
            className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
              !currentExperience
                ? 'bg-emerald-50 font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            Cualquiera
          </button>
          {experienceOptions.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => updateParam('experience', value)}
              className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                currentExperience === value
                  ? 'bg-emerald-50 font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Employment type */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">Tipo de contrato</h3>
        <div className="space-y-1">
          <button
            onClick={() => updateParam('employment', '')}
            className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
              !currentEmployment
                ? 'bg-emerald-50 font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            Cualquiera
          </button>
          {employmentOptions.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => updateParam('employment', value)}
              className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                currentEmployment === value
                  ? 'bg-emerald-50 font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
