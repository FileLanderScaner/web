'use client'

import { useTransition } from 'react'
import { deleteCompanyAction } from './actions'

export function CompanyRow({ company }: { company: { id: string; name: string; slug: string; hq_location: string | null; verified: boolean } }) {
  const [pending, startTransition] = useTransition()

  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
      <div>
        <p className="font-medium text-slate-900 dark:text-white">{company.name}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {company.hq_location ?? 'Sin ubicación'} {company.verified && '· ✓ Verificada'}
        </p>
      </div>
      <button
        onClick={() => {
          if (confirm(`¿Eliminar "${company.name}"?`)) {
            startTransition(() => deleteCompanyAction(company.id))
          }
        }}
        disabled={pending}
        className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
      >
        Eliminar
      </button>
    </div>
  )
}
