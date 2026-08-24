import { z } from 'zod'

/**
 * Validación centralizada de variables de entorno públicas.
 * Las claves anon son seguras para exponer en el cliente: la autorización
 * real la aplican las políticas RLS en la base de datos.
 *
 * Nunca colocar aquí la service_role key ni ningún secreto de servidor.
 */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url({
    error: 'NEXT_PUBLIC_SUPABASE_URL no está definida o no es una URL válida. Revísala en .env.local',
  }),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, {
    message: 'NEXT_PUBLIC_SUPABASE_ANON_KEY no está definida. Revísala en .env.local',
  }),
})

const parsed = publicEnvSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
})

if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `- ${i.message}`).join('\n')
  throw new Error(
    `Configuración de entorno inválida:\n${issues}\n` +
      'Copia .env.example a .env.local y completa los valores.',
  )
}

export const env = {
  supabaseUrl: parsed.data.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: parsed.data.NEXT_PUBLIC_SUPABASE_ANON_KEY,
}

/** URL pública base del sitio, sin barra final. */
export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') ??
    'http://localhost:3000'
  )
}
