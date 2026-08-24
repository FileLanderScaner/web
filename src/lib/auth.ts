import 'server-only'

import { cache } from 'react'
import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/types/database'

/**
 * Obtiene el usuario autenticado actual (o null).
 * Memoinizado por request con React.cache.
 */
export const getCurrentUser = cache(async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
})

/**
 * Obtiene el perfil completo del usuario actual (o null).
 */
export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  const user = await getCurrentUser()
  if (!user) return null

  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return data
})

/**
 * Requiere un usuario autenticado; si no existe, redirige a /login.
 */
export async function requireUser() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  return user
}

/**
 * Requiere un perfil completo; si no existe, redirige a /login.
 */
export async function requireProfile() {
  const user = await requireUser()
  const profile = await getCurrentProfile()
  if (!profile) redirect('/login')
  return { user, profile }
}

/**
 * Requiere que el usuario tenga rol admin; si no, redirige a /dashboard.
 */
export async function requireAdmin() {
  const { user, profile } = await requireProfile()
  if (profile.role !== 'admin') notFound()
  return { user, profile }
}
