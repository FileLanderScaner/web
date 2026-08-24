'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import { formDataString, type FormState } from '@/lib/form-utils'

export type CompanyFormState = FormState

export async function createCompanyAction(
  _prev: CompanyFormState,
  formData: FormData,
): Promise<CompanyFormState> {
  await requireAdmin()
  const supabase = await createClient()

  const name = formDataString(formData, 'name')
  const description = formDataString(formData, 'description')
  const websiteUrl = formDataString(formData, 'website_url')
  const logoUrl = formDataString(formData, 'logo_url')
  const hqLocation = formDataString(formData, 'hq_location')
  const size = formDataString(formData, 'size')

  if (!name) {
    return { error: 'El nombre de la empresa es obligatorio.' }
  }

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  const { error } = await supabase.from('companies').insert({
    slug,
    name,
    description: description || null,
    website_url: websiteUrl || null,
    logo_url: logoUrl || null,
    hq_location: hqLocation || null,
    size: size || null,
  })

  if (error) {
    if (error.code === '23505') {
      return { error: 'Ya existe una empresa con ese nombre.' }
    }
    return { error: 'No se pudo crear la empresa.' }
  }

  revalidatePath('/admin/companies')
  revalidatePath('/companies')
  return { success: 'Empresa creada correctamente.' }
}

export async function deleteCompanyAction(id: string) {
  await requireAdmin()
  const supabase = await createClient()
  await supabase.from('companies').delete().eq('id', id)
  revalidatePath('/admin/companies')
}
