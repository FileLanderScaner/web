import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Callback de Supabase Auth: intercambia el código de confirmación/recuperación
 * por una sesión válida y redirige al usuario a la ruta indicada en `next`.
 *
 * Protección contra open redirect: solo permite rutas relativas que empiecen con `/`.
 */
export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const safeNext = next?.startsWith('/') && !next.startsWith('//') ? next : '/dashboard'
      return NextResponse.redirect(`${origin}${safeNext}`)
    }
  }

  // Si algo falla, al usuario lo enviamos a login con un indicador de error
  return NextResponse.redirect(`${origin}/login?error=auth_callback`)
}
