import type { Metadata } from 'next'
import { ForgotPasswordForm } from './forgot-password-form'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: `Recuperar contraseña | ${site.name}`,
  description: `Restablece la contraseña de tu cuenta ${site.name}.`,
}

export default function ForgotPasswordPage() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
        Recuperar contraseña
      </h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        Ingresa tu correo y te enviaremos un enlace para restablecerla
      </p>
      <ForgotPasswordForm />
    </div>
  )
}
