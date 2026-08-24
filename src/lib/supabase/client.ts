'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import { env } from '@/lib/env'

let client: SupabaseClient<Database> | undefined

/** Cliente Supabase para el navegador (singleton). Usa la anon key. */
export function createClient(): SupabaseClient<Database> {
  if (!client) {
    client = createBrowserClient<Database>(
      env.supabaseUrl,
      env.supabaseAnonKey,
    )
  }
  return client
}
