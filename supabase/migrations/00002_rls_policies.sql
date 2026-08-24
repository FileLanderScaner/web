-- ============================================================================
-- 00002_rls_policies.sql
-- Row Level Security: todas las tablas protegidas desde el día 1.
--
-- Modelo de acceso:
--   - Lectura pública: companies, categories, jobs (solo status='published')
--   - Propietario: profiles (propio), saved_jobs, applications, job_alerts
--   - Escritura restringida a admin: companies, categories, job_sources,
--     jobs, job_categories
-- ============================================================================

-- Helper para habilitar RLS en todas las tablas del esquema público
alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.categories enable row level security;
alter table public.job_sources enable row level security;
alter table public.jobs enable row level security;
alter table public.job_categories enable row level security;
alter table public.saved_jobs enable row level security;
alter table public.applications enable row level security;
alter table public.job_alerts enable row level security;

-- forzar RLS también para el dueño de la tabla
alter table public.profiles force row level security;
alter table public.companies force row level security;
alter table public.categories force row level security;
alter table public.job_sources force row level security;
alter table public.jobs force row level security;
alter table public.job_categories force row level security;
alter table public.saved_jobs force row level security;
alter table public.applications force row level security;
alter table public.job_alerts force row level security;

-- ============================================================================
-- PROFILES
-- ============================================================================
create policy "profiles_select_own_or_admin"
on public.profiles for select
using (auth.uid () = id or public.is_admin ());

create policy "profiles_insert_self"
on public.profiles for insert
with check (auth.uid () = id);

create policy "profiles_update_own"
on public.profiles for update
using (auth.uid () = id)
with check (auth.uid () = id);

create policy "profiles_update_admin"
on public.profiles for update
using (public.is_admin ())
with check (public.is_admin ());

create policy "profiles_delete_own_or_admin"
on public.profiles for delete
using (auth.uid () = id or public.is_admin ());

-- Un usuario nunca puede cambiar su propio rol por la columna `role`.
revoke update on table public.profiles from authenticated;
grant update (full_name, headline, bio, location, website_url, avatar_url)
on table public.profiles to authenticated;

-- ============================================================================
-- COMPANIES (lectura pública; escritura admin)
-- ============================================================================
create policy "companies_select_public"
on public.companies for select
using (true);

create policy "companies_write_admin"
on public.companies for insert
with check (public.is_admin ());

create policy "companies_update_admin"
on public.companies for update
using (public.is_admin ())
with check (public.is_admin ());

create policy "companies_delete_admin"
on public.companies for delete
using (public.is_admin ());

-- ============================================================================
-- CATEGORIES (lectura pública; escritura admin)
-- ============================================================================
create policy "categories_select_public"
on public.categories for select
using (true);

create policy "categories_write_admin"
on public.categories for insert
with check (public.is_admin ());

create policy "categories_update_admin"
on public.categories for update
using (public.is_admin ())
with check (public.is_admin ());

create policy "categories_delete_admin"
on public.categories for delete
using (public.is_admin ());

-- ============================================================================
-- JOB_SOURCES (solo admin ve y administra fuentes)
-- ============================================================================
create policy "job_sources_select_admin"
on public.job_sources for select
using (public.is_admin ());

create policy "job_sources_write_admin"
on public.job_sources for insert
with check (public.is_admin ());

create policy "job_sources_update_admin"
on public.job_sources for update
using (public.is_admin ())
with check (public.is_admin ());

create policy "job_sources_delete_admin"
on public.job_sources for delete
using (public.is_admin ());

-- ============================================================================
-- JOBS (lectura pública solo publicados; escritura admin)
-- ============================================================================
create policy "jobs_select_published_or_admin"
on public.jobs for select
using (status = 'published' or public.is_admin ());

create policy "jobs_write_admin"
on public.jobs for insert
with check (public.is_admin ());

create policy "jobs_update_admin"
on public.jobs for update
using (public.is_admin ())
with check (public.is_admin ());

create policy "jobs_delete_admin"
on public.jobs for delete
using (public.is_admin ());

-- ============================================================================
-- JOB_CATEGORIES (lectura pública; escritura admin)
-- ============================================================================
create policy "job_categories_select_public"
on public.job_categories for select
using (true);

create policy "job_categories_write_admin"
on public.job_categories for insert
with check (public.is_admin ());

create policy "job_categories_delete_admin"
on public.job_categories for delete
using (public.is_admin ());

-- ============================================================================
-- SAVED_JOBS (solo el propietario)
-- ============================================================================
create policy "saved_jobs_select_own"
on public.saved_jobs for select
using (auth.uid () = user_id);

create policy "saved_jobs_insert_own"
on public.saved_jobs for insert
with check (auth.uid () = user_id);

create policy "saved_jobs_delete_own"
on public.saved_jobs for delete
using (auth.uid () = user_id);

-- ============================================================================
-- APPLICATIONS (solo el propietario)
-- ============================================================================
create policy "applications_select_own"
on public.applications for select
using (auth.uid () = user_id);

create policy "applications_insert_own"
on public.applications for insert
with check (auth.uid () = user_id);

create policy "applications_update_own"
on public.applications for update
using (auth.uid () = user_id)
with check (auth.uid () = user_id);

create policy "applications_delete_own"
on public.applications for delete
using (auth.uid () = user_id);

-- ============================================================================
-- JOB_ALERTS (solo el propietario)
-- ============================================================================
create policy "job_alerts_select_own"
on public.job_alerts for select
using (auth.uid () = user_id);

create policy "job_alerts_insert_own"
on public.job_alerts for insert
with check (auth.uid () = user_id);

create policy "job_alerts_update_own"
on public.job_alerts for update
using (auth.uid () = user_id)
with check (auth.uid () = user_id);

create policy "job_alerts_delete_own"
on public.job_alerts for delete
using (auth.uid () = user_id);
