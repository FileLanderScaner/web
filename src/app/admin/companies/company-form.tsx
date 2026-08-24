'use client'

import { useActionState } from 'react'
import { createCompanyAction, type CompanyFormState } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert } from '@/components/ui/alert'

const initialState: CompanyFormState = {}

export function CompanyForm() {
  const [state, formAction, pending] = useActionState(createCompanyAction, initialState)

  return (
    <form action={formAction} className="space-y-4">
      {state.error && <Alert tone="error">{state.error}</Alert>}
      {state.success && <Alert tone="success">{state.success}</Alert>}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="name">Nombre *</Label>
          <Input id="name" name="name" required placeholder="Nombre de la empresa" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="description">Descripción</Label>
          <textarea id="description" name="description" rows={3} className="input resize-none" />
        </div>
        <div>
          <Label htmlFor="website_url">Sitio web</Label>
          <Input id="website_url" name="website_url" type="url" placeholder="https://..." />
        </div>
        <div>
          <Label htmlFor="logo_url">Logo URL</Label>
          <Input id="logo_url" name="logo_url" type="url" placeholder="https://..." />
        </div>
        <div>
          <Label htmlFor="hq_location">Ubicación</Label>
          <Input id="hq_location" name="hq_location" placeholder="Ej: Ciudad de México" />
        </div>
        <div>
          <Label htmlFor="size">Tamaño</Label>
          <Input id="size" name="size" placeholder="Ej: 50-200" />
        </div>
      </div>
      <Button type="submit" loading={pending}>Crear empresa</Button>
    </form>
  )
}
