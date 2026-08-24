import 'server-only'

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { env } from '@/lib/env'

const PROTECTED_PREFIXES = ['/dashboard', '/admin'] as const

/**
 * Refresca la sesión de Supabase en cada navegación y aplica protección
 * optimista de rutas privadas usando solo cookies (sin llamadas a DB).
 *
 * La verificación definitiva ocurre en el servidor (layouts/Server Actions)
 * y en la base de datos mediante RLS.
 */
export async function updateSession(request: NextRequest): Promise<Response> {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    env.supabaseUrl,
    env.supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value)
          }
          supabaseResponse = NextResponse.next({ request })
          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options)
          }
        },
      },
    },
  )

  // Importante: no ejecutar código entre createServerClient y getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isProtected = PROTECTED_PREFIXES.some((p) => path.startsWith(p))

  if (!user && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.search = ''
    url.searchParams.set('redirectTo', path)
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
