import { createClient } from '@/lib/supabase/server'
import { requireUser } from '@/lib/auth'
import { AlertForm } from './alert-form'
import type { Category } from '@/types/database'

export const metadata = { title: 'Alertas — Dashboard' }

const frequencyLabels: Record<string, string> = {
  instant: 'Instantánea',
  daily: 'Diaria',
  weekly: 'Semanal',
}

export default async function AlertsPage() {
  const user = await requireUser()
  const supabase = await createClient()

  const [alertsRes, categoriesRes] = await Promise.all([
    supabase
      .from('job_alerts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('categories')
      .select('*')
      .order('name'),
  ])

  const alerts = alertsRes.data ?? []
  const categories = (categoriesRes.data ?? []) as Category[]

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Alertas</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {alerts.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white py-16 text-center dark:border-slate-700 dark:bg-slate-800">
              <p className="text-lg font-medium text-slate-900 dark:text-white">No tienes alertas</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Crea una alerta y te notificaremos cuando haya empleos nuevos
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{alert.name}</p>
                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>Frecuencia: {frequencyLabels[alert.frequency] ?? alert.frequency}</span>
                      {alert.remote_only && <span>· Solo remoto</span>}
                      {alert.query && <span>· &quot;{alert.query}&quot;</span>}
                    </div>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    alert.active
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                  }`}>
                    {alert.active ? 'Activa' : 'Pausada'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
            <h2 className="mb-4 font-semibold text-slate-900 dark:text-white">Crear alerta</h2>
            <AlertForm categories={categories} />
          </div>
        </div>
      </div>
    </div>
  )
}
