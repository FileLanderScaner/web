'use client'

import { useActionState, useRef } from 'react'
import Link from 'next/link'
import { signInAction } from '../actions'
import { initialFormState } from '@/lib/form-utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert } from '@/components/ui/alert'

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [state, formAction, pending] = useActionState(signInAction, initialFormState)
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      {state.error && <Alert tone="error">{state.error}</Alert>}
      {state.success && <Alert tone="success">{state.success}</Alert>}

      {redirectTo && (
        <input type="hidden" name="redirectTo" value={redirectTo} />
      )}

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
      </div>

      <div>
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          minLength={8}
        />
      </div>

      <div className="text-right">
        <Link
          href="/forgot-password"
          className="text-sm text-emerald-600 hover:underline dark:text-emerald-400"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      <Button type="submit" loading={pending} className="w-full">
        Iniciar sesión
      </Button>

      <p className="text-center text-sm text-slate-600 dark:text-slate-400">
        ¿No tienes cuenta?{' '}
        <Link
          href="/register"
          className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
        >
          Regístrate
        </Link>
      </p>
    </form>
  )
}
