'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { signInSchema, signUpSchema, forgotPasswordSchema, resetPasswordSchema } from '@/validations/auth'
import {
  type FormState,
  authErrorMessage,
  formDataString,
  safeRedirectPath,
} from '@/lib/form-utils'
import { getSiteUrl } from '@/lib/env'

export async function signInAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = signInSchema.safeParse({
    email: formDataString(formData, 'email'),
    password: formDataString(formData, 'password'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Datos inválidos.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    return { error: authErrorMessage(error.message) }
  }

  const redirectTo = safeRedirectPath(formDataString(formData, 'redirectTo'))
  redirect(redirectTo)
}

export async function signUpAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = signUpSchema.safeParse({
    fullName: formDataString(formData, 'fullName'),
    email: formDataString(formData, 'email'),
    password: formDataString(formData, 'password'),
    confirmPassword: formDataString(formData, 'confirmPassword'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Datos inválidos.' }
  }

  const supabase = await createClient()
  const siteUrl = getSiteUrl()

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
      emailRedirectTo: `${siteUrl}/api/auth/callback?next=/dashboard`,
    },
  })

  if (error) {
    return { error: authErrorMessage(error.message) }
  }

  // Si Supabase requiere confirmación de email, session será null
  if (!data.session) {
    return {
      success:
        'Te enviamos un correo de confirmación. Revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.',
    }
  }

  redirect('/dashboard')
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function requestPasswordResetAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formDataString(formData, 'email'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Datos inválidos.' }
  }

  const supabase = await createClient()
  const siteUrl = getSiteUrl()

  // Supabase no revela si el email existe (anti enumeración)
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl}/api/auth/callback?next=/reset-password`,
  })

  if (error) {
    return { error: authErrorMessage(error.message) }
  }

  return {
    success:
      'Si existe una cuenta con ese correo, recibirás un enlace para restablecer tu contraseña.',
  }
}

export async function updatePasswordAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = resetPasswordSchema.safeParse({
    password: formDataString(formData, 'password'),
    confirmPassword: formDataString(formData, 'confirmPassword'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Datos inválidos.' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Tu sesión ha expirado. Solicita un nuevo enlace de recuperación.' }
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  })

  if (error) {
    return { error: authErrorMessage(error.message) }
  }

  redirect('/dashboard')
}
