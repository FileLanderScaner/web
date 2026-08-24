/**
 * Estado estándar que devuelven las Server Actions de formularios.
 * Se usa junto a useActionState en componentes cliente.
 */
export interface FormState {
  /** Mensaje de error de validación o de la operación. */
  error?: string
  /** Mensaje de éxito (p. ej. "revisa tu correo"). */
  success?: string
}

export const initialFormState: FormState = {}

/** Mensajes de error de Supabase Auth traducidos y sin filtrar detalles internos. */
const authErrorMessages: Record<string, string> = {
  'Invalid login credentials': 'Correo o contraseña incorrectos.',
  'Email not confirmed':
    'Debes confirmar tu correo antes de iniciar sesión. Revisa tu bandeja de entrada.',
  'User already registered':
    'Ya existe una cuenta con este correo. Inicia sesión.',
  'Email rate limit exceeded':
    'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.',
  'New password should be different from the old password.':
    'La nueva contraseña debe ser distinta de la anterior.',
}

export function authErrorMessage(rawMessage: string): string {
  if (rawMessage in authErrorMessages) return authErrorMessages[rawMessage]!
  // Nunca exponemos mensajes internos del proveedor de auth.
  return 'Ha ocurrido un problema. Inténtalo de nuevo en unos minutos.'
}

/** Lee un campo string de FormData de forma segura. */
export function formDataString(formData: FormData, name: string): string {
  const value = formData.get(name)
  return typeof value === 'string' ? value : ''
}

/** Sanitiza un parámetro `next` para evitar open redirects. */
export function safeRedirectPath(
  value: string | null | undefined,
  fallback = '/dashboard',
): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return fallback
  }
  return value
}
