'use client'

import { useActionState } from 'react'
import { createAlertAction, type AlertFormState } from './actions'

const initialState: AlertFormState = {}

export function AlertForm({ categories }: { categories: { id: string; name: string }[] }) {
  const [state, formAction, pending] = useActionState(createAlertAction, initialState)

  return (
    <form action={formAction} className="space-y-4">
      {state.error && <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>}
      {state.success && <p className="text-sm text-emerald-600 dark:text-emerald-400">{state.success}</p>}

      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Nombre de la alerta
        </label>
        <input
          id="name"
          name="name"
          required
          placeholder="Ej: Desarrollador React"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
        />
      </div>

      <div>
        <label htmlFor="query" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Palabras clave
        </label>
        <input
          id="query"
          name="query"
          placeholder="Ej: React, TypeScript"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
        />
      </div>

      <div>
        <label htmlFor="category_id" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Categoría
        </label>
        <select
          id="category_id"
          name="category_id"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
        >
          <option value="">Todas</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="frequency" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Frecuencia
        </label>
        <select
          id="frequency"
          name="frequency"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
        >
          <option value="instant">Instantánea</option>
          <option value="daily">Diaria</option>
          <option value="weekly" selected>Semanal</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input id="remote_only" name="remote_only" type="checkbox" value="true" className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
        <label htmlFor="remote_only" className="text-sm text-slate-700 dark:text-slate-300">Solo remoto</label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
      >
        {pending ? 'Creando...' : 'Crear alerta'}
      </button>
    </form>
  )
}
