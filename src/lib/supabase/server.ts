import 'server-only'

import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import { env } from '@/lib/env'

/**
 * Cliente Supabase para Server Components, Server Actions y Route Handlers.
 * Opera con las cookies de la petición actual: las consultas respetan RLS
 * con el rol del usuario autenticado (nunca usa service_role).
 */
export async function createClient(): Promise<SupabaseClient<Database>> {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    env.supabaseUrl,
    env.supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options)
            }
          } catch {
            // Llamado desde un Server Component: solo se puede escribir
            // cookies en Server Actions o Route Handlers. El refresh de
            // sesión lo cubre el proxy.
          }
        },
      },
    },
  )
}
