'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { requestPasswordResetAction } from '../actions'
import { initialFormState } from '@/lib/form-utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert } from '@/components/ui/alert'

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestPasswordResetAction, initialFormState)

  return (
    <form action={formAction} className="space-y-4">
      {state.error && <Alert tone="error">{state.error}</Alert>}
      {state.success && <Alert tone="success">{state.success}</Alert>}

      <div>
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="tu@email.com"
        />
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Te enviaremos un enlace para restablecer tu contraseña.
        </p>
      </div>

      <Button type="submit" loading={pending} className="w-full">
        Enviar enlace
      </Button>

      <p className="text-center text-sm text-slate-600 dark:text-slate-400">
        ¿Recordaste tu contraseña?{' '}
        <Link
          href="/login"
          className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
        >
          Inicia sesión
        </Link>
      </p>
    </form>
  )
}
