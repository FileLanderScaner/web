import { createClient } from '@/lib/supabase/server'
import { CompanyForm } from './company-form'
import { CompanyRow } from './company-row'

export const metadata = { title: 'Empresas — Admin' }

export default async function AdminCompaniesPage() {
  const supabase = await createClient()

  const { data: companies } = await supabase
    .from('companies')
    .select('*')
    .order('name')

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Empresas</h1>

      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <h2 className="mb-4 font-semibold text-slate-900 dark:text-white">Crear empresa</h2>
        <CompanyForm />
      </div>

      {!companies || companies.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white py-16 text-center dark:border-slate-700 dark:bg-slate-800">
          <p className="text-lg font-medium text-slate-900 dark:text-white">No hay empresas</p>
        </div>
      ) : (
        <div className="space-y-2">
          {companies.map((company) => (
            <CompanyRow key={company.id} company={company} />
          ))}
        </div>
      )}
    </div>
  )
}
