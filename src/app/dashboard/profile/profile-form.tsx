'use client'

import { useActionState } from 'react'
import { updateProfileAction, type ProfileFormState } from './actions'
import { Alert } from '@/components/ui/alert'

const initialState: ProfileFormState = {}

export function ProfileForm({
  fullName,
  headline,
  bio,
  location,
  websiteUrl,
}: {
  fullName: string
  headline: string
  bio: string
  location: string
  websiteUrl: string
}) {
  const [state, formAction, pending] = useActionState(updateProfileAction, initialState)

  return (
    <form action={formAction} className="space-y-5">
      {state.error && <Alert tone="error">{state.error}</Alert>}
      {state.success && <Alert tone="success">{state.success}</Alert>}

      <div>
        <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Nombre completo
        </label>
        <input id="fullName" name="fullName" defaultValue={fullName} className="input" />
      </div>

      <div>
        <label htmlFor="headline" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Titular profesional
        </label>
        <input id="headline" name="headline" defaultValue={headline} placeholder="Ej: Desarrollador Full Stack" className="input" />
        <p className="mt-1 text-xs text-slate-400">Aparece bajo tu nombre en tu perfil público</p>
      </div>

      <div>
        <label htmlFor="bio" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Biografía
        </label>
        <textarea id="bio" name="bio" rows={4} defaultValue={bio} placeholder="Cuéntanos sobre ti..." className="input resize-none" />
        <p className="mt-1 text-xs text-slate-400">Máximo 1000 caracteres</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="location" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Ubicación
          </label>
          <input id="location" name="location" defaultValue={location} placeholder="Ej: Ciudad de México" className="input" />
        </div>
        <div>
          <label htmlFor="websiteUrl" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Sitio web
          </label>
          <input id="websiteUrl" name="websiteUrl" type="url" defaultValue={websiteUrl} placeholder="https://..." className="input" />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
      >
        {pending ? 'Guardando...' : 'Guardar cambios'}
      </button>
    </form>
  )
}
