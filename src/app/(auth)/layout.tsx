import Link from 'next/link'
import { site } from '@/lib/site'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <Link
        href="/"
        className="mb-8 text-xl font-bold text-slate-900 dark:text-white"
        aria-label={site.name}
      >
        {site.name}
      </Link>

      <main className="w-full max-w-md">{children}</main>

      <p className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
        © {new Date().getFullYear()} {site.name}. Todos los derechos reservados.
      </p>
    </div>
  )
}
