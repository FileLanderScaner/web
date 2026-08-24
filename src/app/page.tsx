import Link from 'next/link'
import { site } from '@/lib/site'

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold text-slate-900 dark:text-white">
            {site.name}
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Crear cuenta
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-4 text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">
          {site.tagline}
        </h1>
        <p className="mb-8 max-w-lg text-lg text-slate-600 dark:text-slate-400">
          {site.description}
        </p>
        <div className="flex gap-4">
          <Link
            href="/jobs"
            className="rounded-lg bg-emerald-600 px-6 py-3 text-base font-medium text-white hover:bg-emerald-700"
          >
            Ver empleos
          </Link>
          <Link
            href="/register"
            className="rounded-lg border border-slate-300 px-6 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Crear alerta
          </Link>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        © {new Date().getFullYear()} {site.name}. Todos los derechos reservados.
      </footer>
    </div>
  )
}
