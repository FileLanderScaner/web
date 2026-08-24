'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireUser } from '@/lib/auth'
import { formDataString, type FormState } from '@/lib/form-utils'

export type AlertFormState = FormState

export async function createAlertAction(
  _prev: AlertFormState,
  formData: FormData,
): Promise<AlertFormState> {
  const user = await requireUser()
  const supabase = await createClient()

  const name = formDataString(formData, 'name')
  const query = formDataString(formData, 'query')
  const categoryId = formDataString(formData, 'category_id')
  const frequency = formDataString(formData, 'frequency')
  const remoteOnly = formData.get('remote_only') === 'true'

  if (!name) {
    return { error: 'El nombre de la alerta es obligatorio.' }
  }

  if (!['instant', 'daily', 'weekly'].includes(frequency)) {
    return { error: 'Frecuencia no válida.' }
  }

  const { error } = await supabase.from('job_alerts').insert({
    user_id: user.id,
    name,
    query: query || null,
    category_id: categoryId || null,
    frequency: frequency as 'instant' | 'daily' | 'weekly',
    remote_only: remoteOnly,
  })

  if (error) {
    return { error: 'No se pudo crear la alerta.' }
  }

  revalidatePath('/dashboard/alerts')
  return { success: 'Alerta creada correctamente.' }
}
