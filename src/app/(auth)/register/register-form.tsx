'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { signUpAction } from '../actions'
import { initialFormState } from '@/lib/form-utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert } from '@/components/ui/alert'

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(signUpAction, initialFormState)

  return (
    <form action={formAction} className="space-y-4">
      {state.error && <Alert tone="error">{state.error}</Alert>}
      {state.success && <Alert tone="success">{state.success}</Alert>}

      <div>
        <Label htmlFor="fullName">Nombre completo</Label>
        <Input
          id="fullName"
          name="fullName"
          autoComplete="name"
          required
          placeholder="Tu nombre"
        />
      </div>

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
          autoComplete="new-password"
          required
          placeholder="Mínimo 8 caracteres"
          minLength={8}
        />
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Al menos 8 caracteres, una letra y un número.
        </p>
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
        Crear cuenta
      </Button>

      <p className="text-center text-sm text-slate-600 dark:text-slate-400">
        ¿Ya tienes cuenta?{' '}
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
