import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'

/**
 * Proxy de Next.js (antes "middleware"): refresca la sesión de Supabase y
 * protege rutas privadas antes de renderizar. Runtime Node.js por defecto.
 */
export async function proxy(request: NextRequest): Promise<Response> {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Ejecutar en todas las rutas excepto:
     * - _next/static, _next/image (assets internos)
     * - favicon.ico y archivos de metadatos
     * - API routes (el callback de auth necesita cookies limpias)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api/).*)',
  ],
}
