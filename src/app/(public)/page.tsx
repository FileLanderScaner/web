import Link from 'next/link'
import { site } from '@/lib/site'

export default function HomePage() {
  return (
    <>
      <section className="flex flex-col items-center justify-center px-4 py-20 text-center">
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
      </section>
    </>
  )
}
