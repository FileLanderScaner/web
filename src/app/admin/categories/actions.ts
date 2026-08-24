'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import { formDataString, type FormState } from '@/lib/form-utils'

export type CategoryFormState = FormState

export async function createCategoryAction(
  _prev: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  await requireAdmin()
  const supabase = await createClient()

  const name = formDataString(formData, 'name')
  const description = formDataString(formData, 'description')

  if (!name) {
    return { error: 'El nombre de la categoría es obligatorio.' }
  }

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  const { error } = await supabase.from('categories').insert({
    slug,
    name,
    description: description || null,
  })

  if (error) {
    if (error.code === '23505') {
      return { error: 'Ya existe una categoría con ese nombre.' }
    }
    return { error: 'No se pudo crear la categoría.' }
  }

  revalidatePath('/admin/categories')
  revalidatePath('/categories')
  return { success: 'Categoría creada correctamente.' }
}

export async function deleteCategoryAction(id: string) {
  await requireAdmin()
  const supabase = await createClient()
  await supabase.from('categories').delete().eq('id', id)
  revalidatePath('/admin/categories')
}
