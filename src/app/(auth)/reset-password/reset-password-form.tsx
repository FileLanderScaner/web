'use client'

import { useActionState } from 'react'
import { updatePasswordAction } from '../actions'
import { initialFormState } from '@/lib/form-utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert } from '@/components/ui/alert'

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(updatePasswordAction, initialFormState)

  if (state.success) {
    return (
      <Alert tone="success">
        Contraseña actualizada.{' '}
        <a href="/dashboard" className="underline">Ir al dashboard</a>
      </Alert>
    )
  }

  return (
    <form action={formAction} className="space-y-4">
      {state.error && <Alert tone="error">{state.error}</Alert>}

      <div>
        <Label htmlFor="password">Nueva contraseña</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          placeholder="Mínimo 8 caracteres"
          minLength={8}
        />
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          placeholder="Repite tu contraseña"
          minLength={8}
        />
      </div>

      <Button type="submit" loading={pending} className="w-full">
        Guardar contraseña
      </Button>
    </form>
  )
}
