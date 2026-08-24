import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Category } from '@/types/database'

export const metadata = {
  title: 'Categorías de empleo',
  description: 'Explora empleos remotos por categoría: tecnología, diseño, marketing, datos y más.',
}

export default async function CategoriesPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')
    .order('name')

  const categoriesList = (categories ?? []) as Category[]

  // Fetch job counts per category
  const categoryCounts = await Promise.all(
    categoriesList.map(async (cat) => {
      const { count } = await supabase
        .from('job_categories')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', cat.id)
      return { id: cat.id, count: count ?? 0 }
    })
  )

  const countMap = new Map(categoryCounts.map((c) => [c.id, c.count]))

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Categorías de empleo
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-emerald-100">
            Encuentra empleos en tu área de expertise. Filtra por categoría para encontrar
            las mejores oportunidades remotas.
          </p>
        </div>
      </section>

      {/* Categories grid */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        {categoriesList.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white py-16 text-center dark:border-slate-700 dark:bg-slate-800">
            <p className="text-lg font-medium text-slate-900 dark:text-white">
              Aún no hay categorías disponibles
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Vuelve pronto para ver nuevas categorías
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categoriesList.map((category) => (
              <Link
                key={category.id}
                href={`/jobs?category=${category.slug}`}
                className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-emerald-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-emerald-600"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-lg font-bold text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                  {category.name.charAt(0)}
                </div>
                <h3 className="font-semibold text-slate-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {category.description}
                  </p>
                )}
                <p className="mt-3 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  {countMap.get(category.id) ?? 0} empleo{countMap.get(category.id) !== 1 ? 's' : ''}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Popular categories */}
      <section className="bg-slate-50 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="mb-6 text-center text-xl font-bold text-slate-900 dark:text-white">
            Categorías más populares
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categoriesList
              .sort((a, b) => (countMap.get(b.id) ?? 0) - (countMap.get(a.id) ?? 0))
              .slice(0, 6)
              .map((category) => (
                <Link
                  key={category.id}
                  href={`/jobs?category=${category.slug}`}
                  className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50 dark:border-emerald-800 dark:bg-slate-800 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
                >
                  {category.name} ({countMap.get(category.id) ?? 0})
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  )
}
