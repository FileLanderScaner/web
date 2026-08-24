import Link from 'next/link'
import type { Category } from '@/types/database'

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/jobs?category=${category.slug}`}
      className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-emerald-600"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-lg font-bold text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
        {category.name.charAt(0)}
      </div>
      <div>
        <h3 className="font-semibold text-slate-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
          {category.name}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">{category.description ?? 'Empleos disponibles'}</p>
      </div>
    </Link>
  )
}
