import type { Metadata } from 'next'
import { RegisterForm } from './register-form'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: `Crear cuenta | ${site.name}`,
  description: `Regístrate gratis en ${site.name} para guardar empleos, crear alertas y seguir tus postulaciones.`,
}

export default function RegisterPage() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
        Crear cuenta
      </h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        Comienza a encontrar tu próximo empleo remoto
      </p>
      <RegisterForm />
    </div>
  )
}
