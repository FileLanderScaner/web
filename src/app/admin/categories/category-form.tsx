'use client'

import { useActionState } from 'react'
import { createCategoryAction, type CategoryFormState } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert } from '@/components/ui/alert'

const initialState: CategoryFormState = {}

export function CategoryForm() {
  const [state, formAction, pending] = useActionState(createCategoryAction, initialState)

  return (
    <form action={formAction} className="space-y-4">
      {state.error && <Alert tone="error">{state.error}</Alert>}
      {state.success && <Alert tone="success">{state.success}</Alert>}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Nombre *</Label>
          <Input id="name" name="name" required placeholder="Nombre de la categoría" />
        </div>
        <div>
          <Label htmlFor="description">Descripción</Label>
          <Input id="description" name="description" placeholder="Descripción breve" />
        </div>
      </div>
      <Button type="submit" loading={pending}>Crear categoría</Button>
    </form>
  )
}
