'use client'

import { useTransition } from 'react'
import { deleteCategoryAction } from './actions'

export function CategoryRow({ category }: { category: { id: string; name: string; slug: string; description: string | null } }) {
  const [pending, startTransition] = useTransition()

  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
      <div>
        <p className="font-medium text-slate-900 dark:text-white">{category.name}</p>
        {category.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400">{category.description}</p>
        )}
      </div>
      <button
        onClick={() => {
          if (confirm(`¿Eliminar "${category.name}"?`)) {
            startTransition(() => deleteCategoryAction(category.id))
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
