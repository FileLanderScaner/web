import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <p className="mb-2 text-6xl font-bold text-slate-200 dark:text-slate-700">404</p>
      <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
        Página no encontrada
      </h1>
      <p className="mb-6 text-slate-500 dark:text-slate-400">
        La ruta que buscas no existe o fue movida.
      </p>
      <Link href="/">
        <Button>Volver al inicio</Button>
      </Link>
    </div>
  )
}
