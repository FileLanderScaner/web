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
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  // Si Google/Supabase devolvió un error
  if (error) {
    const msg = errorDescription ?? error
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(msg)}`,
    )
  }

  if (code) {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (!exchangeError) {
      const safeNext = next?.startsWith('/') && !next.startsWith('//') ? next : '/dashboard'
      return NextResponse.redirect(`${origin}${safeNext}`)
    }

    // Error en el exchange - redirigir con mensaje
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(exchangeError.message)}`,
    )
  }

  // No hay code ni error - algo salió mal en el flujo OAuth
  return NextResponse.redirect(`${origin}/login?error=no_code`)
}
