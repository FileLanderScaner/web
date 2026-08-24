export const metadata = { title: 'Empleos remotos' }

export default function JobsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
        Empleos remotos
      </h1>
      <p className="text-slate-500 dark:text-slate-400">
        Próximamente: listado de empleos con filtros por categoría, experiencia y salario.
      </p>
    </div>
  )
}
