import Link from 'next/link'
import { site } from '@/lib/site'

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="text-lg font-bold text-slate-900 dark:text-white">
              {site.name}
            </Link>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Empleos remotos en español para profesionales de tecnología, diseño, marketing y más.
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Navegación</h3>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link href="/jobs" className="hover:text-emerald-600 dark:hover:text-emerald-400">Empleos</Link></li>
              <li><Link href="/remote-jobs" className="hover:text-emerald-600 dark:hover:text-emerald-400">Trabajo remoto</Link></li>
              <li><Link href="/categories" className="hover:text-emerald-600 dark:hover:text-emerald-400">Categorías</Link></li>
              <li><Link href="/companies" className="hover:text-emerald-600 dark:hover:text-emerald-400">Empresas</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Tu cuenta</h3>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link href="/register" className="hover:text-emerald-600 dark:hover:text-emerald-400">Crear cuenta</Link></li>
              <li><Link href="/dashboard/saved" className="hover:text-emerald-600 dark:hover:text-emerald-400">Guardados</Link></li>
              <li><Link href="/dashboard/applications" className="hover:text-emerald-600 dark:hover:text-emerald-400">Postulaciones</Link></li>
              <li><Link href="/dashboard/alerts" className="hover:text-emerald-600 dark:hover:text-emerald-400">Alertas</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Legal</h3>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link href="/privacy" className="hover:text-emerald-600 dark:hover:text-emerald-400">Privacidad</Link></li>
              <li><Link href="/terms" className="hover:text-emerald-600 dark:hover:text-emerald-400">Términos</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-200 pt-6 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
          © {new Date().getFullYear()} {site.name}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
