-- ============================================================================
-- seed.sql
-- Datos iniciales: categorías base y datos DEMO (empresas y empleos).
--
-- ⚠️  Las secciones marcadas como DEMO son solo para desarrollo/preview.
--     Elimínalas antes de pasar a producción:
--       delete from public.jobs where source_id is null and slug like 'demo-%';
--       delete from public.companies where slug like 'demo-%';
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Categorías base
-- ----------------------------------------------------------------------------
insert into public.categories (slug, name, description, sort_order) values
  ('desarrollo-software', 'Desarrollo de software', 'Programación, backend, frontend, móvil y DevOps', 1),
  ('diseno-ux', 'Diseño y UX', 'Diseño de producto, UI, UX e investigación', 2),
  ('datos-ia', 'Datos e IA', 'Data science, analítica, machine learning', 3),
  ('marketing', 'Marketing', 'Marketing digital, contenido y crecimiento', 4),
  ('ventas', 'Ventas', 'Sales development, account management', 5),
  ('atencion-cliente', 'Atención al cliente', 'Soporte y customer success', 6),
  ('producto', 'Producto', 'Product management y product ownership', 7),
  ('finanzas', 'Finanzas', 'Contabilidad, finanzas y análisis financiero', 8),
  ('recursos-humanos', 'Recursos humanos', 'Talento, reclutamiento y people ops', 9)
on conflict (slug) do nothing;

-- ----------------------------------------------------------------------------
-- EMPRESAS DEMO
-- ----------------------------------------------------------------------------
insert into public.companies (slug, name, description, hq_location, size) values
  ('demo-nimbus-labs', 'Nimbus Labs (Demo)', 'Estudio de software remoto-first que construye herramientas de productividad.', 'Remoto — LATAM', '11-50'),
  ('demo-orbita-data', 'Órbita Data (Demo)', 'Plataforma de analítica en tiempo real para e-commerce.', 'Madrid, España', '50-200'),
  ('demo-claro-estudio', 'Claro Estudio (Demo)', 'Agencia de diseño de producto para startups SaaS.', 'Ciudad de México', '2-10')
on conflict (slug) do nothing;

-- ----------------------------------------------------------------------------
-- EMPLEOS DEMO
-- ----------------------------------------------------------------------------
with c as (
  select id, slug from public.companies where slug like 'demo-%'
),
cat as (
  select id, slug from public.categories
)
insert into public.jobs (
  slug, title, company_id, description, requirements, benefits,
  location, remote, employment_type, salary_min, salary_max, salary_currency,
  experience_level, skills, published_at, status, featured
)
values
  ('demo-senior-fullstack-react-node',
   'Senior Full-Stack Developer (React / Node)',
   (select id from c where slug = 'demo-nimbus-labs'),
   E'Construirás funcionalidades end-to-end para nuestra suite de colaboración: desde APIs en Node.js hasta interfaces en React.\n\nTrabajarás en un equipo pequeño y asíncrono, con autonomía total sobre tu horario.',
   E'- 5+ años de experiencia con JavaScript/TypeScript\n- Experiencia sólida con React y Node.js\n- Familiaridad con PostgreSQL\n- Comunicación escrita excelente',
   E'- 100% remoto\n- Horario flexible\n- Presupuesto anual de formación\n- 30 días de vacaciones',
   'Remoto — América Latina', true, 'full_time',
   60000, 90000, 'USD', 'senior',
   array['react','typescript','node.js','postgresql'],
   now() - interval '3 days', 'published', true),

  ('demo-frontend-engineer-vue',
   'Frontend Engineer (Vue)',
   (select id from c where slug = 'demo-nimbus-labs'),
   E'Mantendrás y evolucionaremos nuestro dashboard de analítica construido con Vue 3 y TypeScript.',
   E'- 3+ años con Vue o frameworks similares\n- CSS moderno y responsive\n- Tests automatizados',
   E'- Remoto global\n- Equipo distribuido en 8 países',
   'Remoto — Global', true, 'contract',
   45000, 60000, 'USD', 'mid',
   array['vue','typescript','css','vitest'],
   now() - interval '1 day', 'published', false),

  ('demo-data-analyst-ecommerce',
   'Data Analyst — E-commerce',
   (select id from c where slug = 'demo-orbita-data'),
   E'Analizarás comportamientos de compra en plataformas que procesan millones de eventos diarios.',
   E'- SQL avanzado\n- Python para análisis\n- Experiencia con dashboards (Looker, Metabase o similar)',
   E'- Modalidad híbrida (Madrid)\n- Plan de carrera definido',
   'Madrid, España (híbrido)', false, 'full_time',
   38000, 52000, 'EUR', 'mid',
   array['sql','python','looker','dbt'],
   now() - interval '5 days', 'published', false),

  ('demo-ml-engineer-recommendations',
   'ML Engineer — Recommendations',
   (select id from c where slug = 'demo-orbita-data'),
   E'Diseñarás modelos de recomendación que personalizan la experiencia de millones de usuarios.',
   E'- 4+ años en machine learning aplicado\n- Python, scikit-learn, PyTorch\n- MLOps básico',
   E'- Híbrido flexible\n- Stock options',
   'Madrid, España (híbrido)', false, 'full_time',
   55000, 75000, 'EUR', 'senior',
   array['python','pytorch','mlops','sql'],
   now() - interval '2 days', 'published', false),

  ('demo-product-designer-saas',
   'Product Designer (SaaS)',
   (select id from c where slug = 'demo-claro-estudio'),
   E'Liderarás el diseño de producto de clientes B2B: discovery, prototipado y sistemas de diseño.',
   E'- Portfolio con productos SaaS\n- Figma avanzado\n- Investigación con usuarios',
   E'- 100% remoto\n- Proyectos internacionales',
   'Remoto — América Latina', true, 'freelance',
   30000, 48000, 'USD', 'senior',
   array['figma','ux-research','design-systems','prototyping'],
   now() - interval '6 hours', 'published', true),

  ('demo-customer-support-specialist',
   'Customer Support Specialist',
   (select id from c where slug = 'demo-nimbus-labs'),
   E'Ayudarás a nuestros usuarios a sacar el máximo provecho del producto. Turno rotativo América.',
   E'- Español nativo, inglés intermedio\n- Experiencia previa en soporte SaaS deseable',
   E'- Remoto\n- Capacitación pagada',
   'Remoto — México/Colombia/Argentina', true, 'part_time',
   null, null, 'USD', 'junior',
   array['zendesk','soporte','español','inglés'],
   now() - interval '8 hours', 'published', false);

-- Relacionar empleos demo con categorías
insert into public.job_categories (job_id, category_id)
select j.id, cat.id
from public.jobs j
join public.categories cat on (
  (j.slug = 'demo-senior-fullstack-react-node' and cat.slug = 'desarrollo-software') or
  (j.slug = 'demo-frontend-engineer-vue' and cat.slug = 'desarrollo-software') or
  (j.slug = 'demo-data-analyst-ecommerce' and cat.slug = 'datos-ia') or
  (j.slug = 'demo-ml-engineer-recommendations' and cat.slug = 'datos-ia') or
  (j.slug = 'demo-product-designer-saas' and cat.slug = 'diseno-ux') or
  (j.slug = 'demo-customer-support-specialist' and cat.slug = 'atencion-cliente')
)
on conflict do nothing;
