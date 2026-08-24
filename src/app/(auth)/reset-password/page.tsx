import type { Metadata } from 'next'
import { ResetPasswordForm } from './reset-password-form'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: `Restablecer contraseña | ${site.name}`,
  description: `Establece una nueva contraseña para tu cuenta ${site.name}.`,
}

export default function ResetPasswordPage() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
        Nueva contraseña
      </h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        Introduce tu nueva contraseña a continuación
      </p>
      <ResetPasswordForm />
    </div>
  )
}
