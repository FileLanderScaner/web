-- ============================================================================
-- 00001_initial_schema.sql
-- Esquema inicial: enums, tablas, índices, funciones y triggers.
-- Aplicar con: Supabase Dashboard > SQL Editor, o `supabase db push`.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Extensiones
-- ----------------------------------------------------------------------------
create extension if not exists pg_trgm;

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------
create type public.employment_type as enum (
  'full_time',
  'part_time',
  'contract',
  'freelance',
  'internship',
  'temporary'
);

create type public.experience_level as enum (
  'junior',
  'mid',
  'senior',
  'lead'
);

create type public.job_status as enum (
  'draft',
  'published',
  'expired',
  'archived'
);

create type public.alert_frequency as enum (
  'instant',
  'daily',
  'weekly'
);

create type public.source_type as enum (
  'manual',
  'rss',
  'api'
);

-- ----------------------------------------------------------------------------
-- Tabla: profiles (1:1 con auth.users)
-- ----------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'user' check (role in ('user', 'admin')),
  full_name text,
  headline text,
  bio text check (char_length(bio) <= 1000),
  location text,
  website_url text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'Perfil público extendido de cada usuario autenticado.';

-- ----------------------------------------------------------------------------
-- Tabla: companies
-- ----------------------------------------------------------------------------
create table public.companies (
  id uuid primary key default gen_random_uuid (),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null unique check (char_length(name) <= 120),
  description text,
  logo_url text,
  website_url text,
  hq_location text,
  size text,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_companies_name_trgm on public.companies
  using gin (name gin_trgm_ops);

comment on table public.companies is
  'Empresas que publican empleos.';

-- ----------------------------------------------------------------------------
-- Tabla: categories (jerárquica mediante parent_id)
-- ----------------------------------------------------------------------------
create table public.categories (
  id uuid primary key default gen_random_uuid (),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null unique check (char_length(name) <= 80),
  description text,
  parent_id uuid references public.categories (id) on delete set null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_categories_parent on public.categories (parent_id);

comment on table public.categories is
  'Categorías de empleos, con jerarquía opcional.';

-- ----------------------------------------------------------------------------
-- Tabla: job_sources (orígenes de importación de empleos)
-- ----------------------------------------------------------------------------
create table public.job_sources (
  id uuid primary key default gen_random_uuid (),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (char_length(name) <= 120),
  type public.source_type not null default 'manual',
  base_url text,
  config jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  last_imported_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.job_sources is
  'Fuentes de donde se importan empleos (manual, rss, api).';

-- ----------------------------------------------------------------------------
-- Tabla: jobs
-- ----------------------------------------------------------------------------
create table public.jobs (
  id uuid primary key default gen_random_uuid (),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 3 and 200),
  company_id uuid not null references public.companies (id) on delete restrict,
  description text not null,
  requirements text,
  benefits text,
  location text,
  remote boolean not null default false,
  employment_type public.employment_type not null default 'full_time',
  salary_min numeric(12, 2) check (salary_min >= 0),
  salary_max numeric(12, 2)
    check (salary_max is null or salary_min is null or salary_max >= salary_min),
  salary_currency char(3) not null default 'USD' check (salary_currency ~ '^[A-Z]{3}$'),
  experience_level public.experience_level,
  skills text[] not null default '{}'::text[],
  source_id uuid references public.job_sources (id) on delete set null,
  source_url text,
  published_at timestamptz,
  expires_at timestamptz,
  status public.job_status not null default 'draft',
  featured boolean not null default false,
  featured_until timestamptz,
  sponsored_until timestamptz,
  view_count integer not null default 0 check (view_count >= 0),
  search_vector tsvector generated always as (
    setweight(to_tsvector('simple', coalesce(title, '')), 'A')
    || setweight(to_tsvector('simple', coalesce(description, '')), 'B')
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Un empleo publicado debe tener fecha de publicación
  constraint jobs_published_requires_published_at
    check (status <> 'published' or published_at is not null),
  -- Si es remoto no requiere ubicación; si no lo es, se recomienda tenerla
  constraint jobs_source_url_required_when_imported
    check (source_id is null or source_url is not null)
);

-- Índices de búsqueda y listado
create index idx_jobs_published_list on public.jobs (published_at desc nulls last)
  where status = 'published';
create index idx_jobs_featured on public.jobs (published_at desc nulls last)
  where status = 'published' and featured = true;
create index idx_jobs_remote on public.jobs (published_at desc nulls last)
  where status = 'published' and remote = true;
create index idx_jobs_company on public.jobs (company_id);
create index idx_jobs_search_vector on public.jobs using gin (search_vector);
create index idx_jobs_title_trgm on public.jobs using gin (title gin_trgm_ops);
create index idx_jobs_skills on public.jobs using gin (skills);
create index idx_jobs_expires on public.jobs (expires_at)
  where status = 'published' and expires_at is not null;

comment on table public.jobs is
  'Ofertas de empleo. Solo las filas con status = published son públicas.';

-- ----------------------------------------------------------------------------
-- Tabla: job_categories (N:M entre jobs y categories)
-- ----------------------------------------------------------------------------
create table public.job_categories (
  job_id uuid not null references public.jobs (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete cascade,
  primary key (job_id, category_id)
);

create index idx_job_categories_category on public.job_categories (category_id);

comment on table public.job_categories is
  'Relación muchos a muchos entre empleos y categorías.';

-- ----------------------------------------------------------------------------
-- Tabla: saved_jobs (empleos guardados por el usuario)
-- ----------------------------------------------------------------------------
create table public.saved_jobs (
  user_id uuid not null references auth.users (id) on delete cascade,
  job_id uuid not null references public.jobs (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, job_id)
);

create index idx_saved_jobs_job on public.saved_jobs (job_id);

comment on table public.saved_jobs is
  'Empleos guardados ("favoritos") de cada usuario.';

-- ----------------------------------------------------------------------------
-- Tabla: applications (seguimiento de postulaciones del usuario)
-- ----------------------------------------------------------------------------
create table public.applications (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references auth.users (id) on delete cascade,
  job_id uuid not null references public.jobs (id) on delete cascade,
  status text not null default 'applied'
    check (status in ('applied', 'interviewing', 'offer', 'rejected', 'hired', 'withdrawn')),
  notes text check (char_length(notes) <= 4000),
  applied_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, job_id)
);

create index idx_applications_user on public.applications (user_id, applied_at desc);
create index idx_applications_job on public.applications (job_id);

comment on table public.applications is
  'Registro personal de postulaciones. La postulación externa ocurre en source_url; aquí solo se registra el seguimiento.';

-- ----------------------------------------------------------------------------
-- Tabla: job_alerts (alertas de empleo personalizadas)
-- ----------------------------------------------------------------------------
create table public.job_alerts (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  query text,
  location text,
  remote_only boolean not null default false,
  category_id uuid references public.categories (id) on delete set null,
  employment_type public.employment_type,
  experience_level public.experience_level,
  min_salary numeric(12, 2) check (min_salary is null or min_salary >= 0),
  frequency public.alert_frequency not null default 'weekly',
  active boolean not null default true,
  last_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_job_alerts_user on public.job_alerts (user_id);
create index idx_job_alerts_active on public.job_alerts (frequency)
  where active = true;

comment on table public.job_alerts is
  'Alertas de nuevos empleos según filtros guardados por el usuario.';

-- ----------------------------------------------------------------------------
-- Funciones utilitarias
-- ----------------------------------------------------------------------------

-- updated_at automático
create or replace function public.set_updated_at ()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now ();
  return new;
end;
$$;

-- ¿El usuario actual es admin? (security definer para evitar recursión RLS)
create or replace function public.is_admin ()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid () and p.role = 'admin'
  )
$$;

revoke all on function public.is_admin () from anon, authenticated;
grant execute on function public.is_admin () to authenticated;

-- Creación automática de perfil al registrarse en auth.users
create or replace function public.handle_new_user ()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user ();

-- Triggers de updated_at
create trigger trg_profiles_updated
before update on public.profiles
for each row execute function public.set_updated_at ();

create trigger trg_companies_updated
before update on public.companies
for each row execute function public.set_updated_at ();

create trigger trg_categories_updated
before update on public.categories
for each row execute function public.set_updated_at ();

create trigger trg_job_sources_updated
before update on public.job_sources
for each row execute function public.set_updated_at ();

create trigger trg_jobs_updated
before update on public.jobs
for each row execute function public.set_updated_at ();

create trigger trg_applications_updated
before update on public.applications
for each row execute function public.set_updated_at ();

create trigger trg_job_alerts_updated
before update on public.job_alerts
for each row execute function public.set_updated_at ();
