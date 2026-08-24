import type { Metadata } from 'next'
import { Suspense } from 'react'
import { LoginForm } from './login-form'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: `Iniciar sesión | ${site.name}`,
  description: `Accede a tu cuenta de ${site.name} para guardar empleos y crear alertas.`,
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const redirectTo = Array.isArray(params.redirectTo)
    ? params.redirectTo[0]
    : params.redirectTo

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
        Iniciar sesión
      </h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        Ingresa a tu cuenta para continuar
      </p>
      <Suspense>
        <LoginForm redirectTo={redirectTo} />
      </Suspense>
    </div>
  )
}
