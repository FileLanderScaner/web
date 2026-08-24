'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireUser } from '@/lib/auth'

export async function toggleSaveJob(jobId: string) {
  const user = await requireUser()
  const supabase = await createClient()

  const { data: existing } = await supabase
    .from('saved_jobs')
    .select('user_id')
    .eq('user_id', user.id)
    .eq('job_id', jobId)
    .single()

  if (existing) {
    await supabase
      .from('saved_jobs')
      .delete()
      .eq('user_id', user.id)
      .eq('job_id', jobId)
  } else {
    await supabase
      .from('saved_jobs')
      .insert({ user_id: user.id, job_id: jobId })
  }

  revalidatePath('/jobs')
  revalidatePath('/dashboard/saved')
}

export async function removeSavedJob(jobId: string) {
  const user = await requireUser()
  const supabase = await createClient()

  await supabase
    .from('saved_jobs')
    .delete()
    .eq('user_id', user.id)
    .eq('job_id', jobId)

  revalidatePath('/dashboard/saved')
}

export async function createApplication(jobId: string, notes?: string) {
  const user = await requireUser()
  const supabase = await createClient()

  const { error } = await supabase
    .from('applications')
    .insert({
      user_id: user.id,
      job_id: jobId,
      notes: notes || null,
    })

  if (error?.code === '23505') {
    return { error: 'Ya te has postulado a este empleo.' }
  }

  if (error) {
    return { error: 'No se pudo registrar la postulación.' }
  }

  revalidatePath('/jobs')
  revalidatePath('/dashboard/applications')
  return { success: true }
}

export async function updateApplicationStatus(id: string, status: string) {
  const user = await requireUser()
  const supabase = await createClient()

  await supabase
    .from('applications')
    .update({ status })
    .eq('id', id)
    .eq('user_id', user.id)

  revalidatePath('/dashboard/applications')
}
