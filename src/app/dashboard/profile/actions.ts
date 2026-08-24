'use server'

import { createClient } from '@/lib/supabase/server'
import { requireUser } from '@/lib/auth'
import { formDataString, type FormState } from '@/lib/form-utils'

export type ProfileFormState = FormState

export async function updateProfileAction(
  _prev: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const user = await requireUser()

  const fullName = formDataString(formData, 'fullName')
  const headline = formDataString(formData, 'headline')
  const bio = formDataString(formData, 'bio')
  const location = formDataString(formData, 'location')
  const websiteUrl = formDataString(formData, 'websiteUrl')

  if (bio.length > 1000) {
    return { error: 'La biografía no puede exceder 1000 caracteres.' }
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName || null,
      headline: headline || null,
      bio: bio || null,
      location: location || null,
      website_url: websiteUrl || null,
    })
    .eq('id', user.id)

  if (error) {
    return { error: 'No se pudo guardar el perfil. Intenta de nuevo.' }
  }

  return { success: 'Perfil actualizado correctamente.' }
}
