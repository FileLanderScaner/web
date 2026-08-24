'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import { formDataString, type FormState } from '@/lib/form-utils'

export type JobFormState = FormState

export async function createJobAction(
  _prev: JobFormState,
  formData: FormData,
): Promise<JobFormState> {
  await requireAdmin()
  const supabase = await createClient()

  const title = formDataString(formData, 'title')
  const companyId = formDataString(formData, 'company_id')
  const description = formDataString(formData, 'description')
  const location = formDataString(formData, 'location')
  const remote = formData.get('remote') === 'true'
  const employmentType = formDataString(formData, 'employment_type') || 'full_time'
  const experienceLevel = formDataString(formData, 'experience_level')
  const salaryMin = formDataString(formData, 'salary_min')
  const salaryMax = formDataString(formData, 'salary_max')
  const salaryCurrency = formDataString(formData, 'salary_currency') || 'USD'
  const requirements = formDataString(formData, 'requirements')
  const benefits = formDataString(formData, 'benefits')
  const skills = formDataString(formData, 'skills')
  const sourceUrl = formDataString(formData, 'source_url')

  if (!title || !companyId || !description) {
    return { error: 'Título, empresa y descripción son obligatorios.' }
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    + '-' + Date.now().toString(36)

  const { data: job, error } = await supabase
    .from('jobs')
    .insert({
      slug,
      title,
      company_id: companyId,
      description,
      location: location || null,
      remote,
      employment_type: employmentType as 'full_time' | 'part_time' | 'contract' | 'freelance' | 'internship' | 'temporary',
      experience_level: experienceLevel as 'junior' | 'mid' | 'senior' | 'lead' || null,
      salary_min: salaryMin ? Number(salaryMin) : null,
      salary_max: salaryMax ? Number(salaryMax) : null,
      salary_currency: salaryCurrency,
      requirements: requirements || null,
      benefits: benefits || null,
      skills: skills ? skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
      source_url: sourceUrl || null,
      status: 'published',
      published_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (error) {
    return { error: 'No se pudo crear el empleo.' }
  }

  // Handle category assignment
  const categoryId = formDataString(formData, 'category_id')
  if (categoryId && job) {
    await supabase
      .from('job_categories')
      .insert({ job_id: job.id, category_id: categoryId })
  }

  revalidatePath('/admin/jobs')
  redirect('/admin/jobs')
}

export async function deleteJobAction(id: string) {
  await requireAdmin()
  const supabase = await createClient()

  await supabase.from('job_categories').delete().eq('job_id', id)
  await supabase.from('jobs').delete().eq('id', id)

  revalidatePath('/admin/jobs')
}

export async function toggleJobStatus(id: string, currentStatus: string) {
  await requireAdmin()
  const supabase = await createClient()

  const newStatus = currentStatus === 'published' ? 'draft' : 'published'

  await supabase
    .from('jobs')
    .update({
      status: newStatus,
      published_at: newStatus === 'published' ? new Date().toISOString() : null,
    })
    .eq('id', id)

  revalidatePath('/admin/jobs')
}

export async function toggleJobFeatured(id: string, currentFeatured: boolean) {
  await requireAdmin()
  const supabase = await createClient()

  await supabase
    .from('jobs')
    .update({ featured: !currentFeatured })
    .eq('id', id)

  revalidatePath('/admin/jobs')
}
