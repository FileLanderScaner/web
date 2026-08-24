# Nomadea

Plataforma web de búsqueda y descubrimiento de empleos remotos.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack, Server Actions)
- TypeScript (estricto)
- Tailwind CSS v4
- Supabase (PostgreSQL + Auth + RLS)
- Zod (validación)
- Vercel (deploy) · GitHub (CI)

## Requisitos

- Node.js 20.9+
- Una cuenta de [Supabase](https://supabase.com)

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # completa con las credenciales de tu proyecto
npm run dev
```

### Variables de entorno (.env.local)

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto (Dashboard > Settings > API) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima pública |
| `NEXT_PUBLIC_SITE_URL` | URL pública base (canonical/sitemap/redirects) |

Nunca uses la clave `service_role` en este proyecto: todas las consultas pasan por RLS con el rol del usuario autenticado.

### Base de datos

Aplica las migraciones en orden desde **Supabase Dashboard → SQL Editor**:

1. `supabase/migrations/00001_initial_schema.sql`
2. `supabase/migrations/00002_rls_policies.sql`
3. `supabase/seed.sql` (opcional: categorías + datos demo para desarrollo)

## Scripts

```bash
npm run dev     # servidor de desarrollo
npm run build   # build de producción
npm run start   # servir el build
npm run lint    # ESLint
```

## Estructura

```
src/
├── app/            # Rutas App Router: (public), (auth), dashboard, admin
├── components/ui/  # Primitivas reutilizables
├── lib/            # Clientes supabase, env validado, utilidades
├── types/          # Tipos de base de datos
└── validations/    # Schemas Zod
supabase/
└── migrations/     # SQL versionado (esquema + RLS)
```

## Seguridad

- Autenticación vía Supabase Auth; sesión refrescada en el proxy (`src/proxy.ts`)
- Verificación de sesión en layouts y Server Actions (nunca solo en el frontend)
- Row Level Security forzada en todas las tablas (`supabase/migrations/00002_rls_policies.sql`)
- Entradas validadas con Zod en cliente y servidor
