import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import { JobForm } from '../job-form'

export const metadata = { title: 'Nuevo empleo — Admin' }

export default async function NewJobPage() {
  await requireAdmin()
  const supabase = await createClient()

  const [companiesRes, categoriesRes] = await Promise.all([
    supabase.from('companies').select('id, name').order('name'),
    supabase.from('categories').select('id, name').order('name'),
  ])

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Nuevo empleo</h1>
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <JobForm
          companies={companiesRes.data ?? []}
          categories={categoriesRes.data ?? []}
        />
      </div>
    </div>
  )
}
